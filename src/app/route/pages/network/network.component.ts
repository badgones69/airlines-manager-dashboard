import { Component, inject, OnInit } from '@angular/core';
import { RouteService } from '../../../shared/services/route.service';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile.js';
import Stroke from 'ol/style/Stroke.js';
import Style from 'ol/style/Style.js';
import Feature, { FeatureLike } from 'ol/Feature.js';
import { getWidth } from 'ol/extent.js';
import LineString from 'ol/geom/LineString.js';
import VectorLayer from 'ol/layer/Vector.js';
import { getVectorContext } from 'ol/render.js';
import VectorSource from 'ol/source/Vector.js';
import { Arc, GreatCircle } from 'arc';
import { RouteMapper } from '../../../shared/mappers/RouteMapper';
import OSM from 'ol/source/OSM';
import CanvasImmediateRenderer from 'ol/render/canvas/Immediate';
import RenderEvent from 'ol/render/Event';
import { SimpleGeometry } from 'ol/geom';

@Component({
  selector: 'routes-network',
  imports: [],
  templateUrl: './network.component.html',
  styleUrl: './network.component.scss',
})
export class RoutesNetworkComponent implements OnInit {
  /* Map properties */
  public map!: Map;
  public mapLayer!: TileLayer;
  public routesLayer!: VectorLayer;
  public routesSource!: VectorSource;
  public style!: Style;
  public pointsPerMs: number = 0.05;

  public routeMapper: RouteMapper = new RouteMapper();

  /* Injections */
  public routeService = inject(RouteService);

  ngOnInit(): void {
    this.mapLayer = new TileLayer({
      source: new OSM({
        attributions: [],
      }),
    });

    this.map = new Map({
      layers: [this.mapLayer],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 1,
      }),
    });

    this.style = new Style({
      stroke: new Stroke({
        color: '#FF0000',
        width: 2,
      }),
    });

    this.routeService.routes.subscribe((routes) => {
      this.routesSource = new VectorSource({
        loader: () => this.getRoutesSourceLoader(routes),
      });

      this.routesLayer = new VectorLayer({
        source: this.routesSource,
        style: (feature: FeatureLike) => {
          if (feature.get('finished')) {
            return this.style;
          }
          return undefined;
        },
      });
      this.map.addLayer(this.routesLayer);
    });
  }

  /* Routes loading */
  private getRoutesSourceLoader(routes: any[]): void {
    routes.forEach((route, index) => {
      let { departureHub, arrivalAirport } =
        this.routeMapper.routeFromDB(route);

      let arcGenerator: GreatCircle = new GreatCircle(
        { x: departureHub.longitude, y: departureHub.latitude },
        { x: arrivalAirport.longitude, y: arrivalAirport.latitude },
      );

      let arcLine: Arc = arcGenerator.Arc(100, { offset: 10 });
      let geographicalObjects: Feature[] = [];

      arcLine.geometries.forEach((geometry: any) => {
        let line: LineString = new LineString(geometry.coords);
        line.transform('EPSG:4326', 'EPSG:3857');

        geographicalObjects.push(
          new Feature({
            geometry: line,
            finished: false,
          }),
        );
      });

      this.mapLayer.on('postrender', (event: RenderEvent) =>
        this.drawRoutes(event, this.map, this.style, this.routesSource),
      );
      this.displayRoutes(geographicalObjects, this.routesSource, index * 50);
    });
  }

  /* Routes drawing */
  private drawRoutes(
    event: RenderEvent,
    map: Map,
    style: Style,
    source: VectorSource,
  ): void {
    let sourceGeographicalObjects: Feature[] = source.getFeatures();
    let frameStateTime: number = event.frameState?.time ?? 0;
    let vectorContext: CanvasImmediateRenderer = getVectorContext(event);
    vectorContext.setStyle(style);

    for (let geographicalObject of sourceGeographicalObjects) {
      if (!geographicalObject.get('finished')) {
        let coordinates: any[] =
          (
            geographicalObject?.getGeometry() as SimpleGeometry
          ).getCoordinates() ?? [];
        let elapsedTime: number =
          frameStateTime - geographicalObject.get('start');

        if (elapsedTime >= 0) {
          let elapsedPoints: number = elapsedTime * this.pointsPerMs;

          if (elapsedPoints >= coordinates.length) {
            geographicalObject.set('finished', true);
          }

          let maxIndex: number = Math.min(elapsedPoints, coordinates.length);
          let currentLine: LineString = new LineString(
            coordinates.slice(0, maxIndex),
          );

          let worldMapWidth: number = getWidth(
            map.getView().getProjection().getExtent(),
          );
          let worldMapCenter: any[] = map?.getView()?.getCenter() ?? [];
          let offset: number = Math.floor(worldMapCenter[0] / worldMapWidth);

          currentLine.translate(offset * worldMapWidth, 0);
          vectorContext.drawGeometry(currentLine);
          currentLine.translate(worldMapWidth, 0);
          vectorContext.drawGeometry(currentLine);
        }
      }
    }
    map.render();
  }

  /* Routes display */
  private displayRoutes(
    geographicalObjects: Feature[],
    source: VectorSource,
    timeout: number,
  ) {
    globalThis.setTimeout(() => {
      let start: number = Date.now();

      geographicalObjects.forEach((geographicalObject: Feature) => {
        geographicalObject.set('start', start);
        source.addFeature(geographicalObject);

        let coordinates: any[] =
          (
            geographicalObject?.getGeometry() as SimpleGeometry
          ).getCoordinates() ?? [];
        let duration: number = (coordinates.length - 1) / this.pointsPerMs;
        start += duration;
      });
    }, timeout);
  }
}
