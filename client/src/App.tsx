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
                <Route path="admin/projects" element={<AdminProjects/>} />
                <Route path="*" element={<NoPage />} />
              </Routes>
            </div>
            {/* <MailingList/> */}
            <Footer 
              links={[
                { title: 'home', href: '/home' },
                { title: 'contact', href: '/contact' },
                { title: 'about', href: '/about' },
              ]}
              socials={[
                { 
                  icon: (<svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 640 512"><path d="M111.4 256.3l5.8 65-5.8 68.3c-.3 2.5-2.2 4.4-4.4 4.4s-4.2-1.9-4.2-4.4l-5.6-68.3 5.6-65c0-2.2 1.9-4.2 4.2-4.2 2.2 0 4.1 2 4.4 4.2zm21.4-45.6c-2.8 0-4.7 2.2-5 5l-5 105.6 5 68.3c.3 2.8 2.2 5 5 5 2.5 0 4.7-2.2 4.7-5l5.8-68.3-5.8-105.6c0-2.8-2.2-5-4.7-5zm25.5-24.1c-3.1 0-5.3 2.2-5.6 5.3l-4.4 130 4.4 67.8c.3 3.1 2.5 5.3 5.6 5.3 2.8 0 5.3-2.2 5.3-5.3l5.3-67.8-5.3-130c0-3.1-2.5-5.3-5.3-5.3zM7.2 283.2c-1.4 0-2.2 1.1-2.5 2.5L0 321.3l4.7 35c.3 1.4 1.1 2.5 2.5 2.5s2.2-1.1 2.5-2.5l5.6-35-5.6-35.6c-.3-1.4-1.1-2.5-2.5-2.5zm23.6-21.9c-1.4 0-2.5 1.1-2.5 2.5l-6.4 57.5 6.4 56.1c0 1.7 1.1 2.8 2.5 2.8s2.5-1.1 2.8-2.5l7.2-56.4-7.2-57.5c-.3-1.4-1.4-2.5-2.8-2.5zm25.3-11.4c-1.7 0-3.1 1.4-3.3 3.3L47 321.3l5.8 65.8c.3 1.7 1.7 3.1 3.3 3.1 1.7 0 3.1-1.4 3.1-3.1l6.9-65.8-6.9-68.1c0-1.9-1.4-3.3-3.1-3.3zm25.3-2.2c-1.9 0-3.6 1.4-3.6 3.6l-5.8 70 5.8 67.8c0 2.2 1.7 3.6 3.6 3.6s3.6-1.4 3.9-3.6l6.4-67.8-6.4-70c-.3-2.2-2-3.6-3.9-3.6zm241.4-110.9c-1.1-.8-2.8-1.4-4.2-1.4-2.2 0-4.2.8-5.6 1.9-1.9 1.7-3.1 4.2-3.3 6.7v.8l-3.3 176.7 1.7 32.5 1.7 31.7c.3 4.7 4.2 8.6 8.9 8.6s8.6-3.9 8.6-8.6l3.9-64.2-3.9-177.5c-.4-3-2-5.8-4.5-7.2zm-26.7 15.3c-1.4-.8-2.8-1.4-4.4-1.4s-3.1.6-4.4 1.4c-2.2 1.4-3.6 3.9-3.6 6.7l-.3 1.7-2.8 160.8s0 .3 3.1 65.6v.3c0 1.7.6 3.3 1.7 4.7 1.7 1.9 3.9 3.1 6.4 3.1 2.2 0 4.2-1.1 5.6-2.5 1.7-1.4 2.5-3.3 2.5-5.6l.3-6.7 3.1-58.6-3.3-162.8c-.3-2.8-1.7-5.3-3.9-6.7zm-111.4 22.5c-3.1 0-5.8 2.8-5.8 6.1l-4.4 140.6 4.4 67.2c.3 3.3 2.8 5.8 5.8 5.8 3.3 0 5.8-2.5 6.1-5.8l5-67.2-5-140.6c-.2-3.3-2.7-6.1-6.1-6.1zm376.7 62.8c-10.8 0-21.1 2.2-30.6 6.1-6.4-70.8-65.8-126.4-138.3-126.4-17.8 0-35 3.3-50.3 9.4-6.1 2.2-7.8 4.4-7.8 9.2v249.7c0 5 3.9 8.6 8.6 9.2h218.3c43.3 0 78.6-35 78.6-78.3.1-43.6-35.2-78.9-78.5-78.9zm-296.7-60.3c-4.2 0-7.5 3.3-7.8 7.8l-3.3 136.7 3.3 65.6c.3 4.2 3.6 7.5 7.8 7.5 4.2 0 7.5-3.3 7.5-7.5l3.9-65.6-3.9-136.7c-.3-4.5-3.3-7.8-7.5-7.8zm-53.6-7.8c-3.3 0-6.4 3.1-6.4 6.7l-3.9 145.3 3.9 66.9c.3 3.6 3.1 6.4 6.4 6.4 3.6 0 6.4-2.8 6.7-6.4l4.4-66.9-4.4-145.3c-.3-3.6-3.1-6.7-6.7-6.7zm26.7 3.4c-3.9 0-6.9 3.1-6.9 6.9L227 321.3l3.9 66.4c.3 3.9 3.1 6.9 6.9 6.9s6.9-3.1 6.9-6.9l4.2-66.4-4.2-141.7c0-3.9-3-6.9-6.9-6.9z"/></svg>),
                  href: 'https://google.com'
                }
              ]}
            />
          </BrowserRouter>
        </Modal>
      {/* </Storage> */}
    </div>
  );
}

export default App;
