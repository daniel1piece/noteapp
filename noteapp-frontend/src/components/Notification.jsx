const Notification = ({ message }) => {
    // If the value of the message prop is null, then nothing 
    // is rendered to the screen, and in other cases, 
    // the message gets rendered inside of a div element.
    if (message === null){
        return null;
    }

    return (
        <div className="error">
            {message}
        </div>
    )

}

export default Notification