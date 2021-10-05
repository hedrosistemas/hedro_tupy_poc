const { processHealth, processTemp, processRMMS, processAccRaw, processFFT, processRMS2, HDR_SERVICES_TYPE } = require('hdr-process-data')
const { default: axios } = require('axios')

/**
* @typedef ExpressRequest
* @type {object}
* @property {Array<{serviceType: number, collectorId: number, mac: string, rssi: number, raw: string, time: number}>} body - Request Body
*/
/**
 * POSTBACK CONTROLLER
 * @param {ExpressRequest} req
 * @returns {void}
 */
module.exports = async function postBackController(req, res) {
  const postBackArray = req.body

  const processedMessages = []

  postBackArray.forEach(postBackData => {
    switch (postBackData.serviceType) {
      case HDR_SERVICES_TYPE.health:
        processedMessages.push({ serviceType: 'HEALTH', ...processHealth(postBackData.raw, postBackData.time) })
        break;
      case HDR_SERVICES_TYPE.temp:
        processedMessages.push({ serviceType: 'TEMP', ...processTemp(postBackData.raw, postBackData.time) })
        break;
      case HDR_SERVICES_TYPE.rmms:
        processedMessages.push({ serviceType: 'RMMS', ...processRMMS(postBackData.raw, postBackData.time) })
        break;
      case HDR_SERVICES_TYPE.rms2:
        processedMessages.push({ serviceType: 'RMS2', ...processRMS2(postBackData.raw, postBackData.time) })
        break;
      case HDR_SERVICES_TYPE.fft:
        processedMessages.push({ serviceType: 'FFT', ...processFFT(postBackData.raw, postBackData.time) })
        break;
      case HDR_SERVICES_TYPE.accRaw:
        processedMessages.push({ serviceType: 'ACC RAW', ...processAccRaw(postBackData.raw, postBackData.time) })
        break;
      default:
        break;
    }
  })

  await axios.post('http://localhost:3333/javaurl', processedMessages)

  res.status(200).json({})

}