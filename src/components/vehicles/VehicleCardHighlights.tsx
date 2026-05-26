import type { Vehicle } from "@/features/vehicles/types/vehicle.types";
import {
  getVehicleCardSpecs,
  getVehicleConditionTags,
} from "@/features/vehicles/utils/vehicle-formatters";
import { cn } from "@/lib/cn";

type VehicleCardHighlightsProps = {
  vehicle: Vehicle;
  className?: string;
  variant?: "card" | "row";
  showConditionTags?: boolean;
};

export function VehicleCardHighlights({
  vehicle,
  className,
  variant = "card",
  showConditionTags = true,
}: VehicleCardHighlightsProps) {
  const conditionTags = showConditionTags ? getVehicleConditionTags(vehicle) : [];
  const specs = getVehicleCardSpecs(vehicle);

  return (
    <div
      className={cn(
        variant === "card" ? "vehicle-card-highlights" : "vehicle-row-highlights",
        className,
      )}
    >
      {showConditionTags && conditionTags.length > 0 ? (
        <ul className="vehicle-condition-tags" aria-label="Araç durumu">
          {conditionTags.map((tag) => (
            <li key={tag} className="vehicle-condition-tag">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <dl className="vehicle-spec-grid">
        {specs.map((spec) => (
          <div key={spec.label} className="vehicle-spec-item">
            <dt className="vehicle-spec-label">{spec.label}</dt>
            <dd className="vehicle-spec-value">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
