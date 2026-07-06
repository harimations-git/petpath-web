import { Check } from "lucide-react";
import "./AuthProgressStepper.css";

type Step = {
  label: string;
};

type AuthProgressStepperProps = {
  currentStep: number;
  steps?: Step[];
  className?: string;
};

const defaultSteps: Step[] = [
  { label: "Account" },
  { label: "Verify Email" },
  { label: "Details" },
  { label: "Review" },
];

export default function AuthProgressStepper({
  currentStep,
  steps = defaultSteps,
  className = "",
}: AuthProgressStepperProps) {
  return (
    <ol className={`auth-progress-stepper ${className}`}>
      <div className="auth-progress-line" />

      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;

        return (
          <li
            key={step.label}
            className={[
              "auth-progress-step",
              isCompleted ? "completed" : "",
              isCurrent ? "current" : "",
              isUpcoming ? "upcoming" : "",
            ].join(" ")}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span className="auth-progress-circle">
              {isCompleted ? (
                <Check size={14} strokeWidth={4} />
              ) : (
                <span>{stepNumber}</span>
              )}
            </span>

            <span className="auth-progress-label">
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}