import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
//import { useCallback } from "react";

import "leaflet/dist/images/marker-shadow.png";
import L from "leaflet";
//import competitions from "../../competitions_with_latlon.json";
// import competitions from "../../features/competitions";
// import filterProperties from "../../features/filterProperties";
// import customMarker from "../../features/customMarker";
import { filter, updatePlanning } from "../../features/competitions";
import { resetCompetition } from "../../features/customMarker";
import { createPortal } from "react-dom";
import PopupAddCalendar from "../CompetitionList/PopupAddCalendar";

// Import styling
import "../../App.css";
import "leaflet/dist/leaflet.css";

export default function Map2() {
  const dispatch = useDispatch();

  const compets = useSelector((state) => state.competitions);
  const filters = useSelector((state) => state.filterProperties);
  const custMarker = useSelector((state) => state.customMarker);
  const planningPerso = useSelector((state) => state.planningPerso);

  const [showModal, setShowModal] = useState({
    competition: {},
    status: false,
  });

  const [newMarker, setNewMarker] = useState({});

  const mapContainerRef = useRef(null);
  const [items, setItems] = useState([]);
  //const [planningPerso, setPlanningPerso] = useState([]);
  const map = useRef(null);
  const [position, setPosition] = useState([45.813, 3.1876]);
  const [zoom, setZoom] = useState(7);

  // const [data, setData] = useState({
  //   type: "FeatureCollection",
  //   features: [],
  // });
  // const [load, loadData] = useState(true);

  //const mapRef = React.useRef();

  useEffect(() => {
    setItems(compets);
  }, [compets]);

  // useEffect(() => {
  //   dispatch(updatePlanning(planningPerso))
  //   setItems(dispatch(filter({ filters })));
  //   dispatch(resetCompetition());
  //   //console.log("12")
  // }, [planningPerso]);

  // useEffect(() => {
  //   setItems(dispatch(filter({ filters })));
  //   dispatch(resetCompetition());
  //   //setPlanningPerso(planning);
  //   //console.log("1")
  // }, [filters]);

  function callMe(id) {
    compets.list.forEach((item) => {
      if (item.id === id) {
        setShowModal({ competition: item, status: true });
        return;
      }
    });
  }

  useEffect(() => {
    map.current = L.map(mapContainerRef.current).setView(position, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors",
    }).addTo(map.current);

    map.current.on("move", () => {
      setPosition(map.current.getCenter());
      setZoom(map.current.getZoom());
    });

    const geoJSONPointArr = compets.list.map((row) => {
      if (row.address.lon) {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [row.address.lon, row.address.lat, 0],
          },
          properties: row,
        };
      } else {
        return "";
      }
    });

    const getGAO = {
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: geoJSONPointArr.slice(0, 5000),
    };

    var geojsonMarkerOptionsCamp = {
      radius: 8,
      fillColor: "#080705",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };
    var geojsonMarkerOptions3d = {
      radius: 8,
      fillColor: "#805d00",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };
    var geojsonMarkerOptionsNat = {
      radius: 8,
      fillColor: "#2f9126",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };
    var geojsonMarkerOptionsExt = {
      radius: 8,
      fillColor: "#cf1a11",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };
    var geojsonMarkerOptions18m = {
      radius: 8,
      fillColor: "#030ffc",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };
    var geojsonMarkerOptionsPoussins = {
      radius: 8,
      fillColor: "#fff700",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };
    var geojsonMarkerOptionsLoisirs = {
      radius: 8,
      fillColor: "#fc03b1",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    };

    const formatNumber = (number) => {
      return number < 10 ? "0" + number : number;
    };

    function getHours(minutes) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      const formattedHours = hours > 0 ? `${hours}h` : "";
      const formattedMinutes =
        remainingMinutes > 0 ? `${formatNumber(remainingMinutes)}min` : "";
      return (
        formattedHours +
        (formattedHours && formattedMinutes ? "" : "") +
        formattedMinutes
      );
    }

    var earthquakeLayer = L.geoJSON(getGAO, {
      pointToLayer: function (feature, latlng) {
        let options = {};
        switch (feature.properties.discipline) {
          case "Tir en campagne":
            options = geojsonMarkerOptionsCamp;
            break;
          case "Tir 3d":
            options = geojsonMarkerOptions3d;
            break;
          case "Tir à l'arc extérieur":
            options = geojsonMarkerOptionsExt;
            break;
          case "Tir nature":
            options = geojsonMarkerOptionsNat;
            break;
          case "Tir à 18m":
            options = geojsonMarkerOptions18m;
            break;
          case "Tournoi poussin":
            options = geojsonMarkerOptionsPoussins;
            break;
          case "Loisirs":
            options = geojsonMarkerOptionsLoisirs;
            break;
          default:
            break;
        }

        const earthquakeMarker = L.circleMarker(latlng, options);
        // Use mouseenter to open the popup
        earthquakeMarker.on("mouseover", function (e) {
          this.bindPopup(
            `
            <strong>${feature.properties.title}</strong><br>  <br>   
            ${feature.properties.address.address}<br>            
            ${feature.properties.discipline}<br/>
            <strong>Durée: </strong>${getHours(
              feature.properties.address.duration
            )}<br/>
            <strong>Distance: </strong>${Math.round(
              feature.properties.address.distance,
              0
            )}km<br/>
            <strong>Date: </strong>${feature.properties.startDate} - ${
              feature.properties.endDate
            }`
          ).openPopup();
        });

        earthquakeMarker.on("click", function (e) {
          callMe(feature.properties.id);
        });

        // Use mouseleave to close the popup
        earthquakeMarker.on("mouseout", function (e) {
          this.closePopup();
        });

        return earthquakeMarker;
      },
    }).addTo(map.current);

    // DEBUT PARTIE CUSTOM MARKER
    // const newMarker = new L.marker(custMarker[0].latLon).addTo(map.current);
    // newMarker.on("mouseover", function (e) {
    //   this.bindPopup(
    //     `
    //             <strong>${custMarker[0].description}</strong><br>  <br>
    //     `
    //   ).openPopup();
    // });
    // newMarker.on("mouseout", function (e) {
    //   this.closePopup();
    // });
    // FIN PARTIE CUSTOM MARKER

    if (!custMarker.origin.enabled) {
      const newMarker = new L.marker(custMarker.origin.latLon).addTo(
        map.current
      );
      newMarker.on("mouseover", function (e) {
        this.bindPopup(
          `
                  <strong>${custMarker.origin.description}</strong><br>  <br>   
          `
        ).openPopup();
      });
      newMarker.on("mouseout", function (e) {
        this.closePopup();
      });
    }
    //   var myIcon = L.icon({
    //     iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
    //     iconSize: [38, 95],
    //     iconAnchor: [22, 94],
    //     popupAnchor: [-3, -76],

    // });
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });

    // if (custMarker.current.competition) {
    //   const tt= new L.marker(custMarker.current.latLon,{alt:"coucou"} )
    //   setNewMarker(tt)
    //   tt.addTo(map.current)
    //   // const newMarker = new L.marker(custMarker.current.latLon).addTo(
    //   //   map.current
    //   // );
    //   tt.on("mouseover", function (e) {
    //     this.bindPopup(
    //       `

    //       <strong>${custMarker.current.competition.title}</strong><br>  <br>
    //       ${custMarker.current.competition.address.address}<br>
    //       <p>${custMarker.current.competition.discipline}</p><br>
    //       <strong>Durée: </strong>${getHours(
    //         custMarker.current.competition.address.duration
    //       )}<br/>
    //       <strong>Distance: </strong>${Math.round(
    //         custMarker.current.competition.address.distance,
    //         0
    //       )}km<br/><br/>
    //         <strong>Date: </strong>${
    //           custMarker.current.competition.startDate
    //         } - ${custMarker.current.competition.endDate}

    //         `
    //     ).openPopup();
    //   });
    //   tt.on("mouseout", function (e) {
    //     this.closePopup();
    //   });
    // }

    return () => {
      map.current.remove();
      earthquakeLayer.remove();
    };
  }, [items]);

  useEffect(() => {
    const markerOptions = {
      title: "ViewLocation",
      alt: "ViewLocation",
    };

    map.current.eachLayer(function (layer) {
      if (layer.options) {
        if (layer.options.alt === "ViewLocation") {
          map.current.removeLayer(layer);
        }
      }
    });

    if (custMarker.current.competition !== undefined) {
      const tt = new L.marker(custMarker.current.latLon, markerOptions);
      setNewMarker(tt);
      tt.addTo(map.current);
    }

    // if (custMarker.current.competition === undefined){
    //   if (newMarker !== undefined) {
    //     map.current.removeLayer(newMarker);
    //     setNewMarker({})
    //   }
    // }else {
    //   if (map.current.hasLayer(newMarker)) {
    //     //map.current.removeLayer(newMarker);
    //     newMarker.setLatLng(custMarker.current.latLon)
    //   }else{
    //     const tt= new L.marker(custMarker.current.latLon,markerOptions)
    //     console.log("new")
    //     setNewMarker(tt)
    //     tt.addTo(map.current)
    //   }

    // }

    // if (custMarker.current.competition){
    //   const tt= new L.marker(custMarker.current.latLon)
    //   newMarker.
    //   setNewMarker(tt)
    //   tt.addTo(map.current)

    // }

    //
  }, [custMarker, showModal]);

  return (
    <>
      <div
        className=" relative  z-20 map-container h-full"
        ref={mapContainerRef}
      />
      ;
      {showModal.status &&
        createPortal(
          <PopupAddCalendar
            competition={showModal.competition}
            closeModal={() =>
              setShowModal({
                competition: showModal.competition,
                status: false,
              })
            }
          />,
          document.body
        )}
    </>
  );
}
