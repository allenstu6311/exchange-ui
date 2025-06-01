import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'virtual:uno.css'
import router from "@/router/index.tsx"
import { RouterProvider } from 'react-router'
import store from '@/store/index.ts'
import { Provider as ReduxProvider  } from 'react-redux'   
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import { tableTheme } from "@/components/table"

const theme = extendTheme({
  components: {
    Table: tableTheme
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ReduxProvider store={store}>
        <RouterProvider router={router} />
      </ReduxProvider>
    </ChakraProvider>
  </StrictMode>,
)
