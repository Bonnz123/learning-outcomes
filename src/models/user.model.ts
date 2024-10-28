export type dataUser = {
  username: string;
  name: string;
};

export type createUserRequest = {
  username: string;
  name: string;
  password: string;
};

export type loginUserRequest = {
  username: string;
  password: string;
};

export type userResponse = {
  data: dataUser;
  accessToken?: string;
  newAccessToken?: string;
  refreshToken?: string;
};


export type updateUserRequest = {
  name?: string;
  password?: string;
};
