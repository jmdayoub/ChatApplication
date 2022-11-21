import React, { Suspense, useState, useEffect, useCallback } from "react";
import logger from "sabio-debug";
import { Routes, Route, useLocation } from "react-router-dom";
import Chat from "components/chat/Chat";

const DEFAULT_USER = {
  id: 0,
  roles: [],
  firstName: "Jared",
  lastName: "Test",
  email: "",
  isLoggedIn: true,
};
const Loading = () => <div className="">loading....</div>;
const _logger = logger.extend("App");
// _logger("authProtectedFlattenRoutes", authProtectedFlattenRoutes);

export default function App(props) {
  const { pathname } = useLocation();
  let [currentUser, setCurrentUser] = useState(() => {
    return DEFAULT_USER;
  });

  const [loginState, setLoginState] = useState(currentUser.isLoggedIn);

  const [currentPath, setCurrentPath] = useState({
    isPublic: true,
    isSecured: false,
    isUnknown: false,
  });

  const getRouteMapper = useCallback(
    (user) => (routeData) =>
      (
        <Route
          key={routeData.path}
          path={routeData.path}
          exact={routeData.exact}
          name={routeData.name}
          element={
            <routeData.element
              currentUser={user}
              setLoginState={setLoginState}
            />
          }
        />
      ),
    []
  );

  const getMappedRoutes = useCallback(
    (arrOfRouteData, user) => {
      let theseRoutes = arrOfRouteData.map(getRouteMapper(user));
      _logger("getMappedRoutes.", theseRoutes);
      return theseRoutes;
    },
    [getRouteMapper]
  );

  const currentPathCheck = (pp) => {
    let ppPath = pp.path.split("/").filter((el) => el !== "");
    let pathNameCheck = pathname.split("/").filter((el) => el !== "");
    let result = false;
    if (ppPath.length === pathNameCheck.length) {
      if (pathNameCheck.length === 0) {
        result = true;
      } else {
        for (let a = 0; a < pathNameCheck.length; a++) {
          if (pathNameCheck[a] !== ppPath[a]) {
            if (
              ppPath[a].startsWith(":") &&
              pathNameCheck[a].match(/^[0-9]+$/)
            ) {
              result = true;
            } else {
              return false;
            }
          } else {
            result = true;
          }
        }
      }
    }
    return result;
  };
  // ensure that currentPath.path is set to true, but only if it is false AND it should be true
  //   useEffect(() => {
  //     if (publicProtectedFlattenRoutes.some((pp) => currentPathCheck(pp))) {
  //       if (!currentPath.isPublic) {
  //         setCurrentPath(() => {
  //           return { isSecured: false, isPublic: true };
  //         });
  //       }
  //     } else if (!currentPath.isUnknown) {
  //       setCurrentPath(() => {
  //         return { isUnknown: true };
  //       });
  //     }
  //   }, [pathname, currentPath]);

  const generateDynamicRoutes = (currentUser) => {
    _logger("generateDynamicRoutes", authProtectedFlattenRoutes);
    let routes = authProtectedFlattenRoutes.filter((route) => {
      if (route.roles?.length === 0) {
        return true; //all any loggedIn user to see routes that have empty roles
      }
      return route.roles?.some((role) => currentUser.roles.includes(role));
    });
    _logger("generateDynamicRoutes", routes);

    return getMappedRoutes(routes, currentUser);
  };

  const getLast = (arr) => {
    return [arr[arr.length - 1]];
  };

  _logger("render", {
    pathname,
    currentUser,
    currentPath: JSON.stringify(currentPath),
  });
  return (
    <div>
      <Suspense fallback={<Loading />}>
        {/* <DefaultLayout {...props}> */}
        <Routes>
          <Route path="/chat" element={<Chat />} />
        </Routes>
        {/* </DefaultLayout> */}
      </Suspense>
    </div>
  );
}
