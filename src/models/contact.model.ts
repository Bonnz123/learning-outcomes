

export type dataContact = {
  id: number;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type contactRequest = {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type contactResponse = {
  data: dataContact;
  newAccessToken?: string;
};


export type updateContactRequest = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export type searchContact = {
  name?: string;
  email?: string;
  phone?: string;
  page: number;
  size: number;
};

export type paging = {
  size: number;
  totalPage: number;
  currentPage: number;
};

export type pageabel<T> = {
  data: Array<T>;
  paging: paging;
  newAccessToken: string;
};
