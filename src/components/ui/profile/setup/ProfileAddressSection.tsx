import { MapPin } from "lucide-react";
import Spacer from "../../../../components/layout/Spacer";

type ProfileAddressSectionProps = {
    addressLine1: string;
    addressLine2: string;
    townCity: string;
    county: string;
    postcode: string;
    country: string;

    onAddressLine1Change:(value: string) => void;
    onAddressLine2Change:(value: string) => void;
    onTownCityChange:(value: string) => void;
    onCountyChange:(value: string) => void;
    onPostcodeChange:(value: string) => void;
    onCountryChange:(value: string) => void;
};

/**
 * Component handles the address section and manages the state of each address
 * value
 * @param param0 
 * @returns 
 */
export default function ProfileAddressSection({
    addressLine1,
    addressLine2,
    townCity,
    county,
    postcode,
    country,

    onAddressLine1Change,
    onAddressLine2Change,
    onTownCityChange,
    onCountyChange,
    onPostcodeChange,
    onCountryChange,
}: ProfileAddressSectionProps) {
    return (
        <>
            <div className="organisation-form-section-heading">
                <MapPin size={23}/>

                <div>
                    <h2>
                        Organisation address
                    </h2>

                    <p>
                        Enter the main address
                        associated with your
                        organisation.
                    </p>
                </div>
            </div>


            <div className="organisation-address-grid">
                <label className="organisation-address-field organisation-address-field-wide">
                    <span>
                        Address line 1{" "}
                        <strong>*</strong>
                    </span>

                    <input
                        name="addressLine1"
                        autoComplete="address-line1"
                        type="text"
                        placeholder="Building number and street"
                        value={addressLine1}
                        onChange={(event) => onAddressLine1Change(event.target.value)}
                        required
                    />
                </label>


                <label className="organisation-address-field organisation-address-field-wide">
                    <span>
                        Address line 2
                    </span>

                    <input
                        type="text"
                        placeholder="Apartment, unit or additional address"
                        value={addressLine2}
                        onChange={(event) => onAddressLine2Change(event.target.value)}
                    />
                </label>


                <label className="organisation-address-field">
                    <span>
                        Town or city{" "}
                        <strong>*</strong>
                    </span>

                    <input
                        name="townCity"
                        autoComplete="address-level2"
                        type="text"
                        placeholder="Enter town or city"
                        value={townCity}
                        onChange={(event) => onTownCityChange(event.target.value)}
                        required
                    />
                </label>


                <label className="organisation-address-field">
                    <span>
                        County or region
                    </span>

                    <input
                        type="text"
                        placeholder="Optional"
                        value={county}
                        onChange={(event) => onCountyChange(event.target.value)}
                    />
                </label>


                <label className="organisation-address-field">
                    <span>
                        Postcode{" "}
                        <strong>*</strong>
                    </span>

                    <input
                        name="postcode"
                        autoComplete="postal-code"
                        type="text"
                        placeholder="Enter postcode"
                        value={postcode}
                        onChange={(event) => onPostcodeChange( event.target.value)}
                        required
                    />
                </label>


                <label className="organisation-address-field">
                    <Spacer
                        height={5}
                    />

                    <span>
                        Country{" "}
                        <strong>*</strong>
                    </span>

                    <select
                        name="country"
                        autoComplete="country-name"
                        value={country}
                        onChange={(event) => onCountryChange(event.target.value)}
                        required
                    >
                        <option value="">
                            Select Country
                        </option>

                        <option value="United Kingdom">
                            United Kingdom
                        </option>

                        <option value="Ireland">
                            Ireland
                        </option>
                    </select>
                </label>
            </div>
        </>
    );
}