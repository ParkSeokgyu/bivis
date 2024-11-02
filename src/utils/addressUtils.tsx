// addressUtils.tsx
import { Document } from "@/types";
import React from "react";

export function renderAddress(document: Document): JSX.Element | null {
  const { address, address_name, road_address, address_type } = document;
  const region_3depth_name = address?.region_3depth_name;
  const region_3depth_h_name = address?.region_3depth_h_name;

  if (address_type === "REGION_ADDR") {
    return (
      <div>
        <h4 className="font-bold text-base">{address_name}</h4>
        {road_address?.address_name && (
          <p className="text-sm text-gray-600 mt-1">
            {road_address.address_name}
          </p>
        )}
      </div>
    );
  }

  if (address_type === "ROAD_ADDR") {
    return (
      <div>
        <h4 className="font-bold text-base">{address_name}</h4>
        {address?.address_name && (
          <p className="text-sm text-gray-600 mt-1">{address.address_name}</p>
        )}
      </div>
    );
  }

  if (region_3depth_name || region_3depth_h_name) {
    return (
      <div>
        <h4 className="font-bold text-base">{address_name}</h4>
      </div>
    );
  }

  return null;
}
