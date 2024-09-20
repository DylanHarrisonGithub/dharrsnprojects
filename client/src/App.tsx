import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Footer from './components/footer/footer';
import Navbar from './components/navbar/navbar';
import Modal from './components/modal/modal';

import Contact from './pages/contact';
import Login from './pages/login';
import Register from './pages/register';
import About from './pages/about';
import NoPage from './pages/nopage';
import Admin from './pages/admin';

import Storage, { StorageContext } from './components/storage/storage-context';

import HttpService from './services/http.service';
import StorageService from './services/storage.service';

import { defaultTheme } from './definitions/data/data';

import config from './config/config';
import AdminUsers from './pages/admin/admin-users';
import AdminTheme from './pages/admin/admin-theme';
import MailingList from './components/mailing-list/mailing-list';
import AdminMail from './pages/admin/admin-mail';
import Home from './pages/home';
import Projects from './pages/projects';
import AdminProjects from './pages/admin/admin-projects';
import AdminMedia from './pages/admin/admin-media';

function App() {

  // console.log(process.env.NODE_ENV);
  // console.log(process.env.PUBLIC_URL);
  // console.log(process.env.TZ);

  const [storageContext, setStorageContext] = React.useContext(StorageContext);

  React.useEffect(() => {
    (async () => {
      const stgObj = ({
        LOCAL: (() => JSON.parse(localStorage.getItem(config.APP_NAME) || '{}')),
        SESSION: (() => JSON.parse(sessionStorage.getItem(config.APP_NAME) || '{}')),
        COOKIE: (() => {}), // !!!!!TO DO
        WINDOW: (() => ((window as any)[config.APP_NAME]))
      })[config.AUTH_TOKEN_STORAGE_METHOD]();
      HttpService.get('theme').then(res => {
        if (res.success) {
          setStorageContext?.(({ ...stgObj, theme: res.body}));
        } else {
          setStorageContext?.((sc: { [key: string]: any }) => ({ ...stgObj, theme: defaultTheme}));
        }
      });
    })();

    // console.log('public_url', process.env.PUBLIC_URL);
    // console.log('pathname', window.location.pathname);
  }, []);

  return (
    <div className=" mx-auto">
      {/* storage has been mooved to highest level in index.tsx */}
      {/* <Storage keys={['token', 'user', 'events', 'eventsBusy', 'theme']}> */}
        <Modal>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            {/* <Navbar
              brand={config.APP_NAME}
              links={[
                { title: 'home', href: '/home' }
              ]}
              menus={[
                {
                  title: 'about', submenu: [
                    { title: 'contact', href: '/contact' },
                    { title: 'about me', href: '/about' }
                  ] 
                },
                {
                  title: 'links', submenu: [
                    { title: 'google', href: 'https://www.google.com' },
                  ]
                }
              ]}
            /> */}
            <div className={`min-h-screen bg-black`}>
              <Routes>
                <Route path="/" element={<Home />}>
                  <Route index element={<Home />} />
                  <Route path="home" element={<Home />} />
                </Route>
                <Route path="projects" element={<Projects />} />
                <Route path="contact" element={<Contact />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="about" element={<About />} />
                <Route path="nopage" element={<NoPage />} />
                <Route path="admin" element={<Admin />} />
                <Route path="admin/users" element={<AdminUsers/>} />
                <Route path="admin/theme" element={<AdminTheme/>} />
                <Route path="admin/mail" element={<AdminMail/>} />
                <Route path="admin/media" element={<AdminMedia/> } />
                <Route path="admin/projects" element={<AdminProjects/>} />
                <Route path="*" element={<NoPage />} />
              </Routes>
            </div>
            {/* <MailingList/> */}
            <Footer 
              links={[
                { title: 'home', href: '/home' },
                { title: 'projects', href: '/projects' },
                { title: 'login', href: '/login' },
              ]}
              socials={[
                { 
                  icon: (<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512"><path d="M184 48l144 0c4.4 0 8 3.6 8 8l0 40L176 96l0-40c0-4.4 3.6-8 8-8zm-56 8l0 40L64 96C28.7 96 0 124.7 0 160l0 96 192 0 128 0 192 0 0-96c0-35.3-28.7-64-64-64l-64 0 0-40c0-30.9-25.1-56-56-56L184 0c-30.9 0-56 25.1-56 56zM512 288l-192 0 0 32c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-32L0 288 0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-128z"/></svg>),
                  href: 'https://dharrsn.com'
                },
                {
                  icon: (<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 496 512"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>),
                  href: 'https://github.com/dylanharrisongithub/'
                },
                {
                  icon: (<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512"><path d="M61.7 169.4l101.5 278C92.2 413 43.3 340.2 43.3 256c0-30.9 6.6-60.1 18.4-86.6zm337.9 75.9c0-26.3-9.4-44.5-17.5-58.7-10.8-17.5-20.9-32.4-20.9-49.9 0-19.6 14.8-37.8 35.7-37.8 .9 0 1.8 .1 2.8 .2-37.9-34.7-88.3-55.9-143.7-55.9-74.3 0-139.7 38.1-177.8 95.9 5 .2 9.7 .3 13.7 .3 22.2 0 56.7-2.7 56.7-2.7 11.5-.7 12.8 16.2 1.4 17.5 0 0-11.5 1.3-24.3 2l77.5 230.4L249.8 247l-33.1-90.8c-11.5-.7-22.3-2-22.3-2-11.5-.7-10.1-18.2 1.3-17.5 0 0 35.1 2.7 56 2.7 22.2 0 56.7-2.7 56.7-2.7 11.5-.7 12.8 16.2 1.4 17.5 0 0-11.5 1.3-24.3 2l76.9 228.7 21.2-70.9c9-29.4 16-50.5 16-68.7zm-139.9 29.3l-63.8 185.5c19.1 5.6 39.2 8.7 60.1 8.7 24.8 0 48.5-4.3 70.6-12.1-.6-.9-1.1-1.9-1.5-2.9l-65.4-179.2zm183-120.7c.9 6.8 1.4 14 1.4 21.9 0 21.6-4 45.8-16.2 76.2l-65 187.9C426.2 403 468.7 334.5 468.7 256c0-37-9.4-71.8-26-102.1zM504 256c0 136.8-111.3 248-248 248C119.2 504 8 392.7 8 256 8 119.2 119.2 8 256 8c136.7 0 248 111.2 248 248zm-11.4 0c0-130.5-106.2-236.6-236.6-236.6C125.5 19.4 19.4 125.5 19.4 256S125.6 492.6 256 492.6c130.5 0 236.6-106.1 236.6-236.6z"/></svg>),
                  href: 'https://dylansamcsblog.wordpress.com/'
                },
              ]}
            />
          </BrowserRouter>
        </Modal>
      {/* </Storage> */}
    </div>
  );
}

export default App;
