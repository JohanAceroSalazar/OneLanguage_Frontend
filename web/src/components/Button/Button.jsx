function Button({ text, type = "submit", disabled = false, className = "" }) {
    return (
        <button type={type} disabled={disabled} className={className}>
            {text}
        </button>
    );
}

export default Button;
