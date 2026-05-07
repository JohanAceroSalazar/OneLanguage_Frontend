function Input({ name, type = "text", placeholder, onChange, error }) {
    return (
        <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        className={`input ${error ? "input-error" : ""}`}
        />
    );
}

export default Input;