import axios from 'axios';

const parseIGC = async (url) => {
  let flightData = {
    info: {
      manufacturerCode: { value: null, name: "Manufacturer Code" }, // A
      fixAccuracy: { value: null, name: "Fix Accuracy" }, // HFFXA
      dateOfFlight: { value: null, name: "Date Of Flight" }, // HFDTE (UTC)
      pilot: { value: null, name: "Pilot" }, // HFPLT
      copilot: { value: null, name: "Copilot" }, // HFCM2
      gliderType: { value: null, name: "Glider Type" }, // HFGTY
      gliderId: { value: null, name: "Glider ID" }, // HFGID
      tailFinNumber: { value: null, name: "Tail Fin Number" }, // HFCID
      gliderClass: { value: null, name: "Glider Class" }, // HFCCL
      flightRecordedType: { value: null, name: "Flight Recorder" }, // HFFTY
      flightStart: { value: null, name: "Start of flight" }, // HFFTY
      flightEnd: { value: null, name: "End of flight" }, // HFFTY
    },
    logPoints: [], // B
  };
  const parseDateTime = (data, char) => {
    return data.substring(0,2) +
    char +
    data.substring(2,4) +
    char +
    data.substring(4,6);
  }
  const decipherLine = line => {
    if(line[0] === 'B') {
      const timeStamp = parseDateTime(line.substring(1,7), ":");

      const lat = +line.substring(7,9) +
        (line.substring(9,11) + '.' + line.substring(11,14)) / 60 *
        (line[14] === 'N' ? 1 : -1);

      const lng = +line.substring(15,18) +
        (line.substring(18,20) + '.' + line.substring(20,23)) / 60 *
        (line[23] === 'E' ? 1 : -1);

      flightData.logPoints.push({
        timeStamp,
        lat,
        lng,
      });
      return;
    }
    if(line[0] === 'A') {
      flightData.info.manufacturerCode.value = line.substring(1);
      return;
    }

    const IGCCode = line.substring(0,5);
    const payload = line.substring(5).split(":")
    switch (IGCCode) {
      case 'HFFXA': flightData.info.fixAccuracy.value = payload[1]; break;
      case 'HFDTE': flightData.info.dateOfFlight.value = parseDateTime(payload[0], '.'); break;
      case 'HFPLT': flightData.info.pilot.value = payload[1]; break;
      case 'HFCM2': flightData.info.copilot.value = payload[1]; break;
      case 'HFGTY': flightData.info.gliderType.value = payload[1]; break;
      case 'HFGID': flightData.info.gliderId.value = payload[1]; break;
      case 'HFCID': flightData.info.tailFinNumber.value = payload[1]; break;
      case 'HFCCL': flightData.info.gliderClass.value = payload[1]; break;
      case 'HFFTY': flightData.info.flightRecordedType.value = payload[1]; break;
      default: // skip lines that are not relevant
    }
  };

  try {
    const response = await axios.get(url);
    response.data.split("\n").forEach(decipherLine);
  } catch (error) {
    return false;
  }

  flightData.info.flightStart.value = flightData.logPoints[0].timeStamp;
  flightData.info.flightEnd.value = flightData.logPoints[flightData.logPoints.length-1].timeStamp;
  return flightData;
}

export default parseIGC;
