import 'leaflet/dist/leaflet.css'

import L from 'leaflet'
import ejs from 'ejs'

import { getPopupTmpl, getMarkerTmpl } from '@/api'

const ZOOM_LIMIT = { maxZoom: 12, minZoom: 9 } as const
const TILE_UTL_TEMP = 'maps/{id}/{z}/{x}/{y}.webp' as const
const DEFAULT_MAP_ID = '48' as const

const TileUrlTempMap = new Map([
  ['48', TILE_UTL_TEMP],
  ['49', TILE_UTL_TEMP],
  ['61', 'maps/{id}/{z}/{x}_{y}.webp'],
  ['50', 'maps/{id}/{z}/{x}_{y}.webp'],
])

export class MapInstance {
  public map: L.Map | void = void 0
  private tileLayer: L.TileLayer | void = void 0
  private zoomControl: L.Control.Zoom | void = void 0
  private layerGroup: L.LayerGroup | void = void 0

  private popupTmpl: string | void = void 0
  private markerTmpl: string | void = void 0
  constructor(private debug: boolean = false) {
    this.getTemplates()
  }

  private async getTemplates() {
    this.popupTmpl = await getPopupTmpl()
    this.markerTmpl = await getMarkerTmpl()
  }

  init(target: HTMLElement) {
    this.map = L.map(target, {
      ...ZOOM_LIMIT,
      crs: L.CRS.Simple,
      zoom: 10,
      zoomControl: false,
      attributionControl: false,
      center: L.latLng(-0.5, 0.5),
      maxBounds: L.latLngBounds(L.latLng(0, 0), L.latLng(-1, 1))
    })

    this.debug &&
      this.map.on('click', (event) => {
        console.warn('click cordinate', event.latlng)
      })
  }

  renderTile(id: string = DEFAULT_MAP_ID) {
    if (!this.map) return

    if (this.tileLayer) {
      this.layerGroup?.clearLayers()
      this.tileLayer.remove()
      this.tileLayer = void 0
    }

    this.tileLayer = L.tileLayer(TileUrlTempMap.get(id) ?? TILE_UTL_TEMP, { ...ZOOM_LIMIT, id })
    this.tileLayer.addTo(this.map)
    this.map.setView(L.latLng(-0.5, 0.5), 10)
  }

  renderZoomControl() {
    if (!this.map) return

    this.zoomControl = L.control.zoom({ position: 'bottomright', zoomInText: '', zoomOutText: '' })
    this.zoomControl.addTo(this.map)
  }

  renderMarkers(marks: any[]) {
    if (!this.map) return
    this.layerGroup?.clearLayers()

    const markPoints = marks.map((mark) => {
      const { x, y, name, description, iconUrl } = mark
      const contentHtml = ejs.render(this.markerTmpl ?? '', {
        name,
        iconUrl
      })

      const marker = L.marker(L.latLng(x, y), {
        icon: L.divIcon({
          className: 'marker-icon',
          html: contentHtml
        })
      })

      marker.bindPopup(
        L.popup({
          content: ejs.render(this.popupTmpl ?? '', {
            name,
            iconUrl,
            description
          })
        })
      )

      return marker
    })

    this.layerGroup = L.layerGroup(markPoints).addTo(this.map)
  }
}

export default MapInstance
