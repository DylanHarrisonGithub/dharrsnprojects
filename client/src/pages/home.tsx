import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Hero from "../components/hero/hero";
import AspectContainer from "../components/aspect-container/aspect-container";

import HttpService from "../services/http.service";

import { StorageContext } from "../components/storage/storage-context";

import { Theme } from "../definitions/models/Theme/Theme";

import { timeData } from "../definitions/data/data";
import config from "../config/config";
import ThreeCard from "../components/home/three-card";

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const Home: React.FC<any> = (props: any) => {

  const [storageContext, setStorageContext] = React.useContext(StorageContext);
  const navigate = useNavigate();

  const [busy2, setBusy2] = React.useState<boolean>(true);


  return (
    <div className=" relative bg-gradient-to-br from-indigo-500 via-purple-800 to-pink-700">

    </div>
  )
}

export default Home;