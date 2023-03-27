import {useAccount} from "wagmi";
import useSWR from "swr";

export default function useEligibleAirdropSignature() {
  const { address: accountAddress } = useAccount()

  const { data, isLoading } = useSWR(
    `/api/claim?address=${accountAddress}`,
    (url: string) => {
      if (!accountAddress) {
        return null
      }
      return fetch(url).then((response) => response.json())
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    data: data?.result,
    isLoading
  };
}
