import React, { useState, useEffect } from 'react';
import Router from 'next/router';
import NProgress from '../utils/nprogress';
import dynamic from 'next/dynamic';
import { APP_NAME } from '../config';
import { signout, isAuth } from '../actions/auth';
import Search from './posts/Search';
import styles from '../components/Header.module.css';

const DynamicLink = dynamic(() => import('next/link'), {
  ssr: false,
});

const DynamicNavbar = dynamic(
  () => import('reactstrap').then((module) => module.Navbar),
  {
    ssr: false,
  }
);

const DynamicNavbarBrand = dynamic(
  () => import('reactstrap').then((module) => module.NavbarBrand),
  {
    ssr: false,
  }
);

const DynamicCollapse = dynamic(
  () => import('reactstrap').then((module) => module.Collapse),
  {
    ssr: false,
  }
);

const DynamicNav = dynamic(
  () => import('reactstrap').then((module) => module.Nav),
  {
    ssr: false,
  }
);

const DynamicNavItem = dynamic(
  () => import('reactstrap').then((module) => module.NavItem),
  {
    ssr: false,
  }
);

const DynamicNavLink = dynamic(
  () => import('reactstrap').then((module) => module.NavLink),
  {
    ssr: false,
  }
);

const DynamicNavbarText = dynamic(
  () => import('reactstrap').then((module) => module.NavbarText),
  {
    ssr: false,
  }
);

// Import NavbarToggler
const DynamicNavbarToggler = dynamic(
  () => import('reactstrap').then((module) => module.NavbarToggler),
  {
    ssr: false,
  }
);

//NProgress bar
Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSignout = () => {
    signout(() => Router.replace(`/signin`));
  };
  //ok
  return (
    <>
      <DynamicNavbar color="dark" dark expand="md">
        <DynamicLink
          style={{ marginLeft: '8px' }}
          className={`${styles['navbar-brand']} ${styles['no-decoration']}`}
          href="/"
        >
          <DynamicNavbarBrand>{APP_NAME}</DynamicNavbarBrand>
        </DynamicLink>

        {/* Use DynamicNavbarToggler */}
        <DynamicNavbarToggler onClick={toggle} />
        <DynamicCollapse isOpen={isOpen} navbar>
          <DynamicNav className="me-auto" navbar>
            {/* <>
              <DynamicNavItem>
                <DynamicLink
                  className={`${styles['nav-link']} ${styles['no-decoration']}`}
                  href="/"
                >
                  <DynamicNavLink>Home</DynamicNavLink>
                </DynamicLink>
              </DynamicNavItem>
            </> */}

            {/* {isAuth() && (
              <>
                <DynamicNavItem>
                  <DynamicLink
                    className={`${styles['nav-link']} ${styles['no-decoration']}`}
                    href="/user/crud/posts"
                  >
                    <DynamicNavLink className="btn btn-outline-secondary text-light">
                      Create an Event
                    </DynamicNavLink>
                  </DynamicLink>
                </DynamicNavItem>
              </>
            )} */}

            {/* <>
              <DynamicNavItem>
                <DynamicLink
                  className={`${styles['nav-link']} ${styles['no-decoration']}`}
                  href="/contact"
                >
                  <DynamicNavLink className="btn btn-outline-secondary text-light">
                    Contact us
                  </DynamicNavLink>
                </DynamicLink>
              </DynamicNavItem>
            </> */}

            <>
              <DynamicNavItem>
                <DynamicLink
                  className={`${styles['nav-link']} ${styles['no-decoration']}`}
                  href="/posts"
                >
                  <DynamicNavLink className="btn btn-outline-secondary text-light">
                    Events
                  </DynamicNavLink>
                </DynamicLink>
              </DynamicNavItem>
            </>

            <>
              <DynamicNavItem>
                <DynamicLink
                  className={`${styles['nav-link']} ${styles['no-decoration']}`}
                  href="/comunity"
                >
                  <DynamicNavLink className="btn btn-outline-secondary text-light">
                    Feedback Posts
                  </DynamicNavLink>
                </DynamicLink>
              </DynamicNavItem>
            </>

            {!isAuth() && (
              <>
                <DynamicNavItem>
                  <DynamicLink
                    className={`${styles['nav-link']} ${styles['no-decoration']}`}
                    href="/signin"
                  >
                    <DynamicNavLink>Signin</DynamicNavLink>
                  </DynamicLink>
                </DynamicNavItem>
                <DynamicNavItem>
                  <DynamicLink
                    className={`${styles['nav-link']} ${styles['no-decoration']}`}
                    href="/signup"
                  >
                    <DynamicNavLink>Signup</DynamicNavLink>
                  </DynamicLink>
                </DynamicNavItem>
              </>
            )}
            {/* user dashboard */}
            {isAuth() && isAuth().role === 0 && (
              <DynamicNavItem>
                <DynamicLink
                  className={`${styles['nav-link']} ${styles['no-decoration']}`}
                  href="/user"
                >
                  <DynamicNavLink className="btn btn-outline-secondary text-light">{`${
                    isAuth().name
                  }'s Dashboard`}</DynamicNavLink>
                </DynamicLink>
              </DynamicNavItem>
            )}
            {/* admin dashboard */}
            {isAuth() && isAuth().role === 1 && (
              <DynamicNavItem>
                <DynamicLink
                  className={`${styles['nav-link']} ${styles['no-decoration']}`}
                  href="/admin"
                >
                  <DynamicNavLink className="btn btn-outline-secondary text-light">{`${
                    isAuth().name
                  }'s Dashboard`}</DynamicNavLink>
                </DynamicLink>
              </DynamicNavItem>
            )}
            {/* signout button */}
            {isAuth() && (
              <DynamicNavItem className="ms-auto">
                <DynamicNavLink
                  className={`${styles['cursor']}`}
                  onClick={handleSignout}
                >
                  Signout
                </DynamicNavLink>
              </DynamicNavItem>
            )}
          </DynamicNav>
        </DynamicCollapse>
      </DynamicNavbar>
      <Search />
    </>
  );
};

export default Header;
