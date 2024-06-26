import { useEffect, useState } from "react";
import { scaleLinear } from "d3-scale";
import {
    ComposableMap,
    Geographies,
    Geography,
    Sphere
} from "react-simple-maps";
import Api from "../../utils/Api";
import { CURVE_COLOR, SECOND_CURVE_COLOR, TEXT_COLOR } from "../../const";
import { getCountryISO3 } from "../../utils/iso-code";

interface CountryValue {
    query: string;
    extracted_value: Number;
}

interface CountryData {
    geo: string;
    values: CountryValue[];
}

const colorScale = scaleLinear<number>()
    .domain([0, 100])
    .range([CURVE_COLOR, SECOND_CURVE_COLOR] as Iterable<number>);

const GeoMapTrends = () => {
    const [countriesData, setCountriesData] = useState<CountryData[]>([]);

    useEffect(() => {
        const fetchPrice = async () => {
            const geoMap: any = await Api.getGeoMapTrends();
            setCountriesData(geoMap["compared_breakdown_by_region"]);
        };

        fetchPrice();
    }, []);


    return (
        <ComposableMap projectionConfig={{ rotate: [0, 0, 0], scale: 147 }} style={{ minWidth: "50%", height: "480px" }}>
            <Sphere stroke={TEXT_COLOR} strokeWidth={0.5} id={""} fill={"transparent"} />
            {
                countriesData.length > 0 &&
                (
                    <Geographies geography="/features.json">
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const DEFAULT_COLOR = "#f5f4f6"

                                const countryData = countriesData.find((s) => getCountryISO3(s.geo) === geo.id);
                                const fill = countryData ? colorScale(countryData.values[0].extracted_value) : DEFAULT_COLOR;

                                if (countryData != null)
                                    console.log(countryData.values[0].extracted_value)

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={fill as string}
                                        stroke="#efedf0"
                                    />
                                );
                            })
                        }
                    </Geographies>
                )
            }
        </ComposableMap>
    );
};

export default GeoMapTrends;