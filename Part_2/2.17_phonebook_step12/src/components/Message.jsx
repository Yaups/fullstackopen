const Message = ({ error, message }) => {
    const successStyle = {
        color: 'green',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
    const errorStyle = {
        color: 'red',
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }
    const selectedStyle = error ? errorStyle : successStyle

    if (message === null) return null
    else return (
        <div style={selectedStyle}>
            {message}
        </div>
    )
}

export default Message