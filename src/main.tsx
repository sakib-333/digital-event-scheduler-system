import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import './index.css'

import { ThemeProvider } from './components/theme-provider'
import { AuthProvider, useAuth } from './context/auth-context'
import { router } from './router'

import { ToastContainer } from 'react-toastify';

function AppRouter() {
    const auth = useAuth()

    return <RouterProvider router={router} context={{ auth }} />
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)

    root.render(
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
                <AppRouter />
            </AuthProvider>

            <ToastContainer position='top-center' autoClose={3000} />
        </ThemeProvider>
    )
}
