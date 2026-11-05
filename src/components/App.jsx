import React, { useState } from "react";

const steps = [
  { displayText: "Your Details", icon: "01" },
  { displayText: "Date Selection", icon: "02" },
  { displayText: "Guests", icon: "03" },
  { displayText: "Travel Assistance", icon: "04" },
  { displayText: "Payment", icon: "05" },
  { displayText: "Confirmation", icon: "06" },
];

const initialTrip = {
  name: "",
  startLocation: "",
  endLocation: "",
  startDate: "",
  endDate: "",
  adults: 1,
  children: 0,
  infants: 0,
  assistanceNeeded: false,
  assistanceType: "",
  paymentMethod: "",
};

function StepIndicator({ currentStep }) {
  return (
    <ol className="step-list" aria-label="Trip planning progress">
      {steps.map((step, index) => {
        const status =
          index < currentStep ? "completed" : index === currentStep ? "active" : "";

        return (
          <li className={`step-item ${status}`} key={step.displayText}>
            <span className="step-marker" aria-hidden="true">
              {index < currentStep ? (
                <img
                  src="https://assets.ccbp.in/frontend/react-js/travel-trip-steps-successfully-completed-img.png"
                  alt={step.displayText}
                />
              ) : (
                step.icon
              )}
            </span>
            <span className="step-label">{step.displayText}</span>
          </li>
        );
      })}
    </ol>
  );
}

function FormField({ id, label, value, onChange, error, type = "text", ...props }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p className="field-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function GuestCounter({ label, value, onChange, minimum }) {
  const id = label.toLowerCase();

  return (
    <div className="guest-row">
      <div>
        <label className="guest-label" htmlFor={`${id}-count`}>
          {label}
        </label>
        <p className="guest-hint">
          {label === "Adults" ? "Ages 13 or above" : label === "Children" ? "Ages 2–12" : "Under 2 years"}
        </p>
      </div>
      <div className="counter">
        <button
          type="button"
          className="counter-button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          onClick={() => onChange(Math.max(minimum, value - 1))}
          disabled={value <= minimum}
        >
          −
        </button>
        <output id={`${id}-count`} aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          className="counter-button"
          aria-label={`Increase ${label.toLowerCase()}`}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

function SummaryItem({ label, children }) {
  return (
    <div className="summary-item">
      <span>{label}</span>
      <strong>{children || "Not provided"}</strong>
    </div>
  );
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [trip, setTrip] = useState(initialTrip);
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  const updateTrip = (field, value) => {
    setTrip((previousTrip) => ({
      ...previousTrip,
      [field]: value,
      ...(field === "paymentMethod" ? { demoPaymentComplete: false } : {}),
    }));
    setErrors((previousErrors) => ({ ...previousErrors, [field]: "" }));
  };

  const validateStep = () => {
    const nextErrors = {};

    if (currentStep === 0) {
      if (!trip.name.trim()) nextErrors.name = "Enter your name";
      if (!trip.startLocation.trim()) nextErrors.startLocation = "Enter your start location";
      if (!trip.endLocation.trim()) nextErrors.endLocation = "Enter your end location";
    } else if (currentStep === 1) {
      if (!trip.startDate) nextErrors.startDate = "Select start date";
      if (!trip.endDate) nextErrors.endDate = "Select end date";
      if (trip.startDate && trip.endDate && trip.endDate < trip.startDate) {
        nextErrors.endDate = "The end date cannot be less than the start date";
      }
    } else if (currentStep === 3 && trip.assistanceNeeded && !trip.assistanceType) {
      nextErrors.assistanceType = "Select a travel assistance option";
    } else if (currentStep === 4 && !trip.paymentMethod) {
      nextErrors.paymentMethod = "Choose a payment method";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (currentStep === 4) {
      setTrip((previousTrip) => ({ ...previousTrip, demoPaymentComplete: true }));
    }
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const goPrevious = () => {
    setErrors({});
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  const startNewTrip = () => {
    setTrip(initialTrip);
    setErrors({});
    setConfirmed(false);
    setCurrentStep(0);
  };

  const updateGuest = (field, value) => updateTrip(field, value);

  if (confirmed) {
    return (
      <main className="page-shell">
        <header className="topbar">
          <a className="brand" href="#" onClick={(event) => event.preventDefault()}>
            <span className="brand-mark" aria-hidden="true">T</span>
            tripwise
          </a>
          <span className="topbar-note">Your next story starts here</span>
        </header>
        <section className="success-card" aria-live="polite">
          <img
            className="success-image"
            src="https://assets.ccbp.in/frontend/react-js/travel-trip-steps-successfully-completed-img.png"
            alt="success"
          />
          <p className="eyebrow">ALL SET</p>
          <h1>Trip confirmed!</h1>
          <p className="success-copy">
            Thanks, {trip.name}. Your trip from {trip.startLocation} to {trip.endLocation} is ready to go.
          </p>
          <div className="confirmed-details" aria-label="Booked trip details">
            <h2>Booked trip details</h2>
            <SummaryItem label="Traveler">{trip.name}</SummaryItem>
            <SummaryItem label="From">{trip.startLocation}</SummaryItem>
            <SummaryItem label="To">{trip.endLocation}</SummaryItem>
            <SummaryItem label="Dates">
              {trip.startDate} – {trip.endDate}
            </SummaryItem>
            <SummaryItem label="Guests">
              {trip.adults} adults · {trip.children} children · {trip.infants} infants
            </SummaryItem>
            <SummaryItem label="Payment method">{trip.paymentMethod}</SummaryItem>
            <SummaryItem label="Assistance">
              {trip.assistanceNeeded ? trip.assistanceType : "Not needed"}
            </SummaryItem>
            <SummaryItem label="Payment status">Demo payment complete — no charge</SummaryItem>
          </div>
          <button className="button button-primary" type="button" onClick={startNewTrip}>
            Book New Trip
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark" aria-hidden="true">T</span>
          tripwise
        </a>
        <span className="topbar-note">Your next story starts here</span>
      </header>

      <section className="intro">
        <p className="eyebrow">LET’S MAKE IT HAPPEN</p>
        <h1>Plan a trip you’ll <span>never forget.</span></h1>
        <p>Just a few details and you’ll be on your way.</p>
      </section>

      <section className="booking-card" aria-label="Plan your trip">
        <StepIndicator currentStep={currentStep} />
        <div className="form-panel">
          <div className="form-heading">
            <span className="heading-kicker">
              STEP {String(currentStep + 1).padStart(2, "0")} OF {String(steps.length).padStart(2, "0")}
            </span>
            <h2>{steps[currentStep].displayText}</h2>
            <p>
              {currentStep === 0 && "Tell us a little about where you’re headed."}
              {currentStep === 1 && "When would you like your adventure to begin?"}
              {currentStep === 2 && "Who’s coming along for the ride?"}
              {currentStep === 3 && "Let us know if we can make your journey easier."}
              {currentStep === 4 && "Choose a demo payment method to continue."}
              {currentStep === 5 && "Take a look and make sure everything is right."}
            </p>
          </div>

          {currentStep === 0 && (
            <div className="fields-grid">
              <FormField
                id="name"
                label="Your name"
                placeholder="e.g. Alex Morgan"
                value={trip.name}
                error={errors.name}
                onChange={(event) => updateTrip("name", event.target.value)}
              />
              <FormField
                id="startLocation"
                label="Start location"
                placeholder="Where are you starting?"
                value={trip.startLocation}
                error={errors.startLocation}
                onChange={(event) => updateTrip("startLocation", event.target.value)}
              />
              <FormField
                id="endLocation"
                label="End location"
                placeholder="Where do you want to go?"
                value={trip.endLocation}
                error={errors.endLocation}
                onChange={(event) => updateTrip("endLocation", event.target.value)}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="fields-grid date-grid">
              <FormField
                id="startDate"
                label="Start date"
                type="date"
                value={trip.startDate}
                error={errors.startDate}
                onChange={(event) => updateTrip("startDate", event.target.value)}
              />
              <FormField
                id="endDate"
                label="End date"
                type="date"
                value={trip.endDate}
                error={errors.endDate}
                min={trip.startDate || undefined}
                onChange={(event) => updateTrip("endDate", event.target.value)}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="guest-list">
              <GuestCounter
                label="Adults"
                value={trip.adults}
                minimum={1}
                onChange={(value) => updateGuest("adults", value)}
              />
              <GuestCounter
                label="Children"
                value={trip.children}
                minimum={0}
                onChange={(value) => updateGuest("children", value)}
              />
              <GuestCounter
                label="Infants"
                value={trip.infants}
                minimum={0}
                onChange={(value) => updateGuest("infants", value)}
              />
              <p className="guest-total">
                {trip.adults + trip.children + trip.infants} travelers in your party
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="assistance-panel">
              <label className="checkbox-row" htmlFor="assistanceNeeded">
                <input
                  id="assistanceNeeded"
                  type="checkbox"
                  checked={trip.assistanceNeeded}
                  onChange={(event) => {
                    updateTrip("assistanceNeeded", event.target.checked);
                    if (!event.target.checked) updateTrip("assistanceType", "");
                  }}
                />
                <span className="checkbox-copy">
                  <strong>Travel assistance needed</strong>
                  <span>We’ll help make your trip more comfortable.</span>
                </span>
              </label>
              {trip.assistanceNeeded && (
                <div className="field assistance-options">
                  <label htmlFor="assistanceType">Choose the assistance you need</label>
                  <select
                    id="assistanceType"
                    value={trip.assistanceType}
                    aria-invalid={Boolean(errors.assistanceType)}
                    aria-describedby={errors.assistanceType ? "assistanceType-error" : undefined}
                    onChange={(event) => updateTrip("assistanceType", event.target.value)}
                  >
                    <option value="">Select an option</option>
                    <option value="Wheelchair assistance">Wheelchair assistance</option>
                    <option value="Mobility assistance">Mobility assistance</option>
                    <option value="Visual or hearing assistance">Visual or hearing assistance</option>
                    <option value="Other assistance">Other assistance</option>
                  </select>
                  {errors.assistanceType && (
                    <p className="field-error" id="assistanceType-error" role="alert">
                      {errors.assistanceType}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="payment-panel">
              <div className="demo-payment-note">
                <span aria-hidden="true">ⓘ</span>
                <p><strong>Demo checkout</strong> — this is a preview. No real payment will be taken.</p>
              </div>
              <div className="field">
                <label htmlFor="paymentMethod">Payment method</label>
                <select
                  id="paymentMethod"
                  value={trip.paymentMethod}
                  aria-invalid={Boolean(errors.paymentMethod)}
                  aria-describedby={errors.paymentMethod ? "paymentMethod-error" : undefined}
                  onChange={(event) => updateTrip("paymentMethod", event.target.value)}
                >
                  <option value="">Select a demo payment method</option>
                  <option value="Credit or debit card (demo)">Credit or debit card (demo)</option>
                  <option value="PayPal (demo)">PayPal (demo)</option>
                </select>
                {errors.paymentMethod && (
                  <p className="field-error" id="paymentMethod-error" role="alert">
                    {errors.paymentMethod}
                  </p>
                )}
              </div>
              <p className="payment-disclaimer">
                Payment amounts and processing aren’t connected in this demo.
              </p>
            </div>
          )}

          {currentStep === 5 && (
            <div className="summary">
              <div className="summary-section">
                <h3>Your journey</h3>
                <SummaryItem label="Traveler">{trip.name}</SummaryItem>
                <SummaryItem label="From">{trip.startLocation}</SummaryItem>
                <SummaryItem label="To">{trip.endLocation}</SummaryItem>
              </div>
              <div className="summary-section">
                <h3>Dates & guests</h3>
                <SummaryItem label="Start date">{trip.startDate}</SummaryItem>
                <SummaryItem label="End date">{trip.endDate}</SummaryItem>
                <SummaryItem label="Travelers">
                  {trip.adults} adults · {trip.children} children · {trip.infants} infants
                </SummaryItem>
              </div>
              <div className="summary-section">
                <h3>Travel assistance</h3>
                <SummaryItem label="Assistance">
                  {trip.assistanceNeeded ? trip.assistanceType : "Not needed"}
                </SummaryItem>
              </div>
              <div className="summary-section">
                <h3>Payment</h3>
                <SummaryItem label="Method">{trip.paymentMethod}</SummaryItem>
                <SummaryItem label="Status">
                  {trip.demoPaymentComplete ? "Demo payment complete — no charge" : "Not completed"}
                </SummaryItem>
              </div>
            </div>
          )}

          <div className={`form-actions ${currentStep === 0 ? "actions-first" : ""}`}>
            {currentStep > 0 && (
              <button className="button button-secondary" type="button" onClick={goPrevious}>
                <span aria-hidden="true">←</span> Previous
              </button>
            )}
            {currentStep === 5 && (
              <button className="button button-quiet" type="button" onClick={startNewTrip}>
                Cancel
              </button>
            )}
            {currentStep < 5 ? (
              <button className="button button-primary" type="button" onClick={goNext}>
                {currentStep === 4 ? "Complete demo payment" : "Next"} <span aria-hidden="true">→</span>
              </button>
            ) : (
              <button className="button button-primary" type="button" onClick={() => setConfirmed(true)}>
                Confirm trip <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </section>
      <footer className="page-footer">Made for the places that stay with you.</footer>
    </main>
  );
}

export default App;
