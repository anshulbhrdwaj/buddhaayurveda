const CheckoutSteps = ({ current = 0 }) => {
  return (
    <ul className="steps steps-vertical mt-4 w-full lg:steps-horizontal">
      {['User Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (step, index) => (
          <li
            key={step}
            className={`step ${
              index < current ? 'step-primary' : '' // Steps before the current
            } ${
              index === current ? 'step-warning' : '' // Current step
            } ${
              current === 4 && index === 3 ? 'step-warning' : '' // Special case for step 3 in step 4
            } ${
              current === 4 && index < 3 ? 'step-primary' : '' // Steps before step 3 in step 4
            }`}
          >
            {step}
          </li>
        )
      )}
    </ul>
  );
};

export default CheckoutSteps;
