'use client';

import { App } from 'antd';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { AuthContext } from '@/context/authorization-context';
import Profile from '@/components/user-profile/user-profile';
import getCountries from '@/pages/api/get-countries';

import Paths from '../../utils/route-links';

const Page = (): JSX.Element => {
  const [countries, setCountries] = useState<string[]>([]);
  const { isLoggedIn } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    async function fetchCountries() {
      const countryList = await getCountries();
      setCountries(countryList);
    }
    fetchCountries();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push(Paths.LOGIN);
    }
  }, [isLoggedIn, router]);

  return <App notification={{ placement: 'bottom' }}>{isLoggedIn && <Profile countries={countries} />}</App>;
};

export default Page;
