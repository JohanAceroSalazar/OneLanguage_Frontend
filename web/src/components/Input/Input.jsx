function Input({
    name,
    type = "text",
    placeholder,
    onChange,
    onBlur,
    value,
    error,
    autoComplete,
    disabled = false,
    inputMode,
}) {
    return (
        <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            autoComplete={autoComplete}
            disabled={disabled}
            inputMode={inputMode}
            aria-invalid={error}
            className={`input ${error ? "input-error" : ""}`}
        />
    );
}

export default Input;
