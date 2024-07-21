import { AppLayout } from '@app/components/ui/layouts'
import { Error404Page } from '@app/pages'
import OverviewPage from '@app/pages/network/OverviewPage'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Routes from './routes'

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error404Page />,
    children: [
      {
        index: true,
        element: <Navigate to={Routes.NETWORK.ROOT} />
      },
      {
        path: Routes.NETWORK.ROOT,
        children: [
          {
            index: true,
            element: <OverviewPage />
          },
          {
            path: 'tick',
            // element: <TickPage />,
            element: <p>Tick Page</p>,
            children: [
              {
                path: ':tick',
                element: <p>Tick Page</p>
              }
            ]
          }
          // {
          //   path: 'tx',
          //   element: <TxPage />,
          //   children: [
          //     {
          //       path: ':txId',
          //       element: <TxPage />
          //     }
          //   ]
          // },
          // {
          //   path: 'address',
          //   element: <AddressPage />,
          //   children: [
          //     {
          //       path: ':addressId',
          //       element: <AddressPage />
          //     }
          //   ]
          // }
        ]
      }
    ]
  }
])

export default router
