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
        const healthObj = { serviceType: 'HEALTH', mac: postBackData.mac, ...processHealth(postBackData.raw, postBackData.time) }
        healthObj.maxTemp = parseFloat(healthObj.maxTemp).toFixed(2)
        healthObj.temp = parseFloat(healthObj.temp).toFixed(2)
        processedMessages.push(healthObj)
        break;
      case HDR_SERVICES_TYPE.temp:
        processedMessages.push({ serviceType: 'TEMP', mac: postBackData.mac, ...processTemp(postBackData.raw, postBackData.time) })
        break;
      case HDR_SERVICES_TYPE.rmms:
        processedMessages.push({ serviceType: 'RMMS', mac: postBackData.mac, ...processRMMS(postBackData.raw, postBackData.time) })
        break;
      /*
      case HDR_SERVICES_TYPE.rms2:
        processedMessages.push({ serviceType: 'RMS2', mac: postBackData.mac, ...processRMS2(postBackData.raw, postBackData.time) })
        break;
      case HDR_SERVICES_TYPE.fft:
        processedMessages.push({ serviceType: 'FFT', mac: postBackData.mac, ...processFFT(postBackData.raw, postBackData.time) })
        break;
      case HDR_SERVICES_TYPE.accRaw:
        processedMessages.push({ serviceType: 'ACC RAW', mac: postBackData.mac, ...processAccRaw(postBackData.raw, postBackData.time) })
        break;
       */
      default:
        break;
    }
  })

  if (processedMessages.length > 0) {
    try {
      await axios.post('http://portal1-qas.tupy.com.br/CondicaoEquipamentoAPI/rest/hedro/criar', processedMessages)
    } catch (err) {
      console.log(`Error posting to Java server.\nProcessed messages: ${JSON.stringify(processedMessages)}\n\nError: ${err}\n\n`)
    }
  }

  res.status(200).json({})

}
