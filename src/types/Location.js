import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const L = typeof window !== 'undefined' && require('leaflet')

const LocationTypeEditor = ({ field, value, onChange }) => {
  const mapRef = useRef()
  const mapObject = useRef()
  const markerLayer = useRef()
  const changeHandler = useRef()
  changeHandler.current = onChange

  // Initialize map
  useEffect(() => {
    if (!L) return
    mapObject.current = L.map(mapRef.current)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapObject.current)

    markerLayer.current = L.layerGroup().addTo(mapObject.current)

    mapObject.current.on('click', (e) => {
      changeHandler.current([e.latlng.lat, e.latlng.lng])
    })

    setTimeout(() => mapObject.current.invalidateSize(), 0)

  }, [])

  // Update map on change
  useEffect(() => {
    if (value) {
      markerLayer.current.clearLayers()
      const marker = L.marker(value, { draggable: 'true' })
      marker.on('dragend', () => {
        const latlng = marker.getLatLng()
        changeHandler.current([latlng.lat, latlng.lng])
      })
      marker.addTo(markerLayer.current)
      mapObject.current.setView(value, mapObject.current.getZoom() || 5)
    } else {
      mapObject.current.setView([0, 0], 1)
    }
  }, [value])

  return <div className="field-map" ref={mapRef} />
}

LocationTypeEditor.propTypes = {
  field: PropTypes.object.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

const LocationTypeViewer = ({ value }) =>
  value ? <span>({value[0]}, {value[1]})</span> : false

LocationTypeViewer.propTypes = {
  value: PropTypes.any
}

export default {
  name: 'location',
  view: LocationTypeViewer,
  edit: LocationTypeEditor
}
