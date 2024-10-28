import { addresses } from "@prisma/client";
import { tokenAndRefresh } from "../utils/token.util";

export type addressRequest = {
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postalCode: string;
  contactId: number;
};

export type dataAddress = {
  id: number;
  street?: string;
  city?: string;
  province?: string;
  country: string;
  postalCode: string;
};

export type addressResponse<T> = {
  data: T;
  newAccessToken?: string;
};

export type updateAddressRequest = {
  id: number;
  street?: string;
  city?: string;
  province?: string;
  country?: string;
  postalCode?: string;
  contactId: number;
};
