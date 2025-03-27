const PasswordRequirement = ({ isValid, message }) => (
  <div
    className={`flex items-center gap-2 ${
      isValid ? "text-green-500" : "text-red-500"
    }`}
  >
    {isValid ? (
      <span>&#10003;</span> // Checkmark symbol
    ) : (
      <span>&#10007;</span> // Cross symbol
    )}
    <span className="text-sm">{message}</span>
  </div>
);

export default PasswordRequirement;
