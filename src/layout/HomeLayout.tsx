import React from "react";
import Header from "./Header";

interface Props {
  children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = ({ children }) => {
  return <Header>{children}</Header>;
};

export default HomeLayout;
