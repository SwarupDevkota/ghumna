import PropTypes from "prop-types";

const Button = ({ children, text, onClick, variant = "primary" }) => {
  const baseStyles = "mt-3 w-full text-white py-2 rounded-lg transition";
  const primaryStyles = "bg-amber-500 hover:bg-amber-600";
  const secondaryStyles = "bg-gray-500 hover:bg-gray-600";

  return (
    <button
      className={`${baseStyles} ${
        variant === "secondary" ? secondaryStyles : primaryStyles
      }`}
      onClick={onClick}
    >
      {text || children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary"]),
};

export default Button;
