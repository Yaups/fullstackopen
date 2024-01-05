describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    const newUser = {
      username: 'Test-User-For-Cypress',
      password: 'Test-Password-For-Cypress',
      name: 'Cypress Cypresson'
    }
    const anotherUser = {
      username: 'Another-Test-User',
      password: 'Another-Password',
      name: 'Another User'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, newUser)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, anotherUser)

    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Log in')
    cy.contains('Username')
    cy.contains('Password')

    cy.get('#login-username').should('exist')
    cy.get('#login-password').should('exist')
    cy.get('#login-button').should('exist')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#login-username').type('Test-User-For-Cypress')
      cy.get('#login-password').type('Test-Password-For-Cypress')
      cy.get('#login-button').click()

      cy.contains('Logged in as Cypress Cypresson')
    })

    it('fails with wrong credentials', function () {
      cy.get('#login-username').type('Test-User-For-Cypress')
      cy.get('#login-password').type('wrong-password')
      cy.get('#login-button').click()

      cy.get('#notification-message')
        .should('contain', 'Login failed. Check username/password and connection to server.')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html')
        .should('not.contain', 'Logged in as Cypress Cypresson')
        .and('not.contain', 'Blogs')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({
        username: 'Test-User-For-Cypress',
        password: 'Test-Password-For-Cypress'
      })
      cy.visit('')
    })

    it('A blog can be created', function () {
      cy.contains('Open new blog form').click()
      cy.get('#blogForm-title-input').type('Test blog title')
      cy.get('#blogForm-author-input').type('Test blog author')
      cy.get('#blogForm-url-input').type('Test blog url')
      cy.get('#blogForm-post-button').click()

      cy.get('#notification-message')
        .should('contain', 'New blog added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('contain', 'Test blog title - Test blog author')
    })

    describe('And a blog exists', function () {
      beforeEach(function () {
        const newBlog = {
          title: 'This is a test blog',
          author: 'Tom A',
          url: 'https://fullstackopen.com/en/part5/end_to_end_testing'
        }

        cy.addBlog(newBlog)

        cy.visit('')
      })

      it('Any user can like that blog', function () {
        cy.contains('Show').click()
        cy.contains('Likes: 0')

        cy.contains('Like').click()
        cy.contains('Likes: 1')

        //Refresh page and check likes count again
        cy.visit('')
        cy.contains('Show').click()
        cy.contains('Likes: 1')

        //Log in on another account
        cy.contains('Log out').click()
        cy.login({
          username: 'Another-Test-User',
          password: 'Another-Password'
        })
        cy.visit('')
        cy.contains('Logged in as Another User')

        cy.contains('Show').click()
        cy.contains('Likes: 1')

        cy.contains('Like').click()
        cy.contains('Likes: 2')

        //Refresh page and check likes count again
        cy.visit('')
        cy.contains('Show').click()
        cy.contains('Likes: 2')

      })

      it('The user who created the blog can delete it', function () {
        cy.contains('Show').click()

        cy.contains('Delete').click()

        cy.get('html').should('not.contain', 'This is a test blog - Tom A')
        cy.visit('')
        cy.get('html').should('not.contain', 'This is a test blog - Tom A')
      })

      it('A user who did not post the blog cannot see the delete button', function () {
        cy.contains('Log out').click()

        cy.login({
          username: 'Another-Test-User',
          password: 'Another-Password'
        })
        cy.visit('')
        cy.contains('Logged in as Another User')

        cy.contains('Show').click()

        cy.get('html')
          .should('contain', 'This is a test blog - Tom A')
          .and('not.contain', 'Delete')
      })
    })

    describe('And multiple blogs exist', function () {
      beforeEach(function () {
        const firstNewBlog = {
          title: 'Blog with 10 initial likes',
          author: 'Tom A',
          url: 'https://fullstackopen.com/en/part5/end_to_end_testing',
          likes: 10
        }

        const secondNewBlog = {
          title: 'Blog with 20 initial likes',
          author: 'Tom A',
          url: 'https://fullstackopen.com/en/part5/end_to_end_testing',
          likes: 20
        }

        const thirdNewBlog = {
          title: 'Blog with 19 initial likes',
          author: 'Tom A',
          url: 'https://fullstackopen.com/en/part5/end_to_end_testing',
          likes: 19
        }

        cy.addBlog(firstNewBlog)
        cy.addBlog(secondNewBlog)
        cy.addBlog(thirdNewBlog)
        cy.visit('')
      })

      it('The blogs are ordered in descending order of likes', function () {
        //Check that the intitial blog order is correct
        cy.get('.blog').eq(0).should('contain', 'Blog with 20 initial likes')
        cy.get('.blog').eq(1).should('contain', 'Blog with 19 initial likes')
        cy.get('.blog').eq(2).should('contain', 'Blog with 10 initial likes')

        //Like one of the top blogs and check that it rises to the top
        cy.contains('Blog with 19 initial likes')
          .contains('Show').click()

        cy.contains('Blog with 19 initial likes')
          .contains('Like').click()

        cy.contains('Blog with 19 initial likes')
          .contains('Likes: 20')
          .contains('Like').click()

        cy.contains('Blog with 19 initial likes')
          .contains('Likes: 21')

        //Check that the blog order has shifted correctly
        cy.get('.blog').eq(0).should('contain', 'Blog with 19 initial likes')
        cy.get('.blog').eq(1).should('contain', 'Blog with 20 initial likes')
        cy.get('.blog').eq(2).should('contain', 'Blog with 10 initial likes')

        //Refresh and re-check.
        cy.visit('')
        cy.get('.blog').eq(0).should('contain', 'Blog with 19 initial likes')
        cy.get('.blog').eq(1).should('contain', 'Blog with 20 initial likes')
        cy.get('.blog').eq(2).should('contain', 'Blog with 10 initial likes')
      })
    })
  })
})