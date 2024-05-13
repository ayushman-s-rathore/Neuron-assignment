
import { useCallback, useEffect, useMemo,  useState } from "react";
import MapGL, { FullscreenControl, Marker, NavigationControl, Popup, ScaleControl} from "react-map-gl";
import Papa from 'papaparse'
import ShipInfo from "../../component/shipInfo";
import { fetchCSVData } from "../../utils/fetchCSVData";
import DrawControl from "../../utils/drawControl";








const TOKEN = import.meta.env.VITE_TOKEN;
const Map = () => {
  const [data, setData]= useState([])
  const [ text, setText ] = useState("");
  const [popupInfo, setPopupInfo] = useState(null);

  


  useEffect(()=>{
   const res=fetchCSVData('./port_geo_location - port_geo_location.csv')
   fetchData()   

  },[text])

  const fetchData = async () => {
    const res= await fetchCSVData('./port_geo_location - port_geo_location.csv')
    if(res)setText(res)
    try {
      if(text=="")return
      Papa.parse(text, {
        header: true,
        complete: (result) => {
          setData(result.data);
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    } catch (error) {
      console.error('Error fetching CSV file:', error);
    }
  };
  const markers = useMemo(()=>data.map((port,id)=> 
  (
    
   <Marker key={id}
    longitude={port.geo_location_longitude}
    latitude={port.geo_location_latitude}
    anchor="bottom"
    onClick={e => {
      // If we let the click event propagates to the map, it will immediately close the popup
      // with `closeOnClick: true`
      e.originalEvent.stopPropagation();
      setPopupInfo(port);
    }}
          >
       <div style={{ color: 'red', fontSize: 10 }}>📍</div>
    </Marker>
  )),[data])

  const onUpdate = useCallback(e => {
    const points = e.features[0].geometry.cordinates[0][0]
    console.log(points)
    
  }, []);

  const onDelete = useCallback(e => {
    setFeatures(currFeatures => {
      const newFeatures = {...currFeatures};
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  

  return (
    <>
      <div className="h-screen relative">
      <div className="flex flex-col items-center text-lg border bg-gray-400 p-2">
        Enemy Ship Locator
      </div>

      <MapGL
        mapboxAccessToken={TOKEN}
        initialViewState={{
          zoom: 2,
        }}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        transitionDuration="200"
        
      > 
        
        <DrawControl
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true
          }}
          default="draw-polygon"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />   
        <ShipInfo/>
        
      {markers}
      {popupInfo && (
          <Popup
            anchor="top"
            longitude={Number(popupInfo.geo_location_longitude)}
            latitude={Number(popupInfo.geo_location_latitude)}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              {popupInfo.port_name}
            </div>
          </Popup>
        )}
       
      </MapGL>
      </div>
    </>
  );
};

export default Map;
