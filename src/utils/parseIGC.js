import axios from 'axios';

const parseIGC = async (url) => {
  let flightData = {
    manufacturerCode: null, // A
    fixAccuracy: null, // HFFXA
    dateOfFlight: null, // HFDTE (UTC)
    pilot: null, // HFPLT
    copilot: null, // HFCM2
    gliderType: null, // HFGTY
    gliderId: null, // HFGID
    tailFinNumber: null, // HFCID
    gliderClass: null, // HFCCL
    flightRecordedType: null, // HFFTY
    logPoints: [], // B
  };

  const decipherLine = line => {
    if(line[0] === 'B') {
      flightData.logPoints.push({
        timeStamp: line.substring(1,7),
        lat: line.substring(7,15),
        lng: line.substring(15,24),
      });
      return;
    }
    if(line[0] === 'A') {
      flightData.manufacturerCode = line.substring(1);
      return;
    }

    const IGCCode = line.substring(0,5);
    const payload = line.substring(5)
    switch (IGCCode) {
      case 'HFFXA': flightData.fixAccuracy = payload; break;
      case 'HFDTE': flightData.dateOfFlight = payload; break;
      case 'HFPLT': flightData.pilot = payload; break;
      case 'HFCM2': flightData.copilot = payload; break;
      case 'HFGTY': flightData.gliderType = payload; break;
      case 'HFGID': flightData.gliderId = payload; break;
      case 'HFCID': flightData.tailFinNumber = payload; break;
      case 'HFCCL': flightData.gliderClass = payload; break;
      case 'HFFTY': flightData.flightRecordedType = payload; break;
      default: console.log(line); break;
    }

  };

  try {
    const response = await axios.get(url);
    response.data.split("\n").forEach(decipherLine);
  } catch (error) {
    console.error(error);
    return;
  }
  console.log(flightData);
}

export default parseIGC;
