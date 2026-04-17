/* eslint-disable */

// Route tree for TanStack Router — manually maintained (JS version)

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as ZoneZoneIdRouteImport } from './routes/zone.$zoneId'
import { Route as CompareRouteImport } from './routes/compare'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
})

const ZoneZoneIdRoute = ZoneZoneIdRouteImport.update({
  id: '/zone/$zoneId',
  path: '/zone/$zoneId',
  getParentRoute: () => rootRouteImport,
})

const CompareRoute = CompareRouteImport.update({
  id: '/compare',
  path: '/compare',
  getParentRoute: () => rootRouteImport,
})

const rootRouteChildren = {
  IndexRoute: IndexRoute,
  ZoneZoneIdRoute: ZoneZoneIdRoute,
  CompareRoute: CompareRoute,
}

export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)
