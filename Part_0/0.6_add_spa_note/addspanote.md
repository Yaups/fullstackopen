sequenceDiagram
    participant browser
    participant server

    Note right of browser: JavaScript code runs browser-side to do the following: <br/> Disable default handling of submission <br/> Add note to notes list browser-side <br/> Rerender notes list browser-side

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note left of server: Server runs script to add note to notes list
    server-->>browser: 201 (created)
    deactivate server