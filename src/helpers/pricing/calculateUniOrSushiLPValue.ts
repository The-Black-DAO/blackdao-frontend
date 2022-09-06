import { BigNumber } from "ethers";
import { instanceOf } from "prop-types";
import { Token } from "src/helpers/contracts/Token";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { NetworkId } from "src/networkDetails";
import { PairContract__factory } from "src/typechain";

export const calculateUniOrSushiLPValue = async ({
  lpToken,
  networkId,
  poolTokens,
}: {
  networkId: NetworkId;
  poolTokens: [Token, Token];
  lpToken: Token<typeof PairContract__factory>;
}) => {
  console.log('debug calcFunc start')
  const contract = lpToken.getEthersContract(networkId);
  console.log('debug calcFunc st1', contract.getReserves())
  // const bn_Temp = BigNumber.from('1000')
  // const n_temp = 1662425342
  // console.log('debug calcFunc st3', typeof(n_temp))
  const [tokenBalances, lpSupply, ...tokenPrices] = await Promise.all([
    contract.getReserves().then(balances =>
      balances
        // We filter out blockTimestampLast from the balances
        .filter(balance => { 
          return typeof(balance) !== typeof(1)
        })
        .map((balance, i) => new DecimalBigNumber(balance as BigNumber, poolTokens[i].decimals)),
    ),
    contract.totalSupply().then(supply => new DecimalBigNumber(supply, lpToken.decimals)),
    ...poolTokens.map(token => token.getPrice(networkId as NetworkId)),
  ]);

  console.log('debug calcFunc st2', tokenBalances, lpSupply, tokenPrices)
  const totalValueOfLpInUsd = tokenBalances.reduce(
    // For each token, we multiply the amount in the pool by it's USD value
    (sum, balance, i) => sum.add(balance.mul(tokenPrices[i])),
    new DecimalBigNumber("0"),
  );
  
  console.log('debug calcFunc end', totalValueOfLpInUsd, lpSupply, totalValueOfLpInUsd.div(lpSupply))
  return totalValueOfLpInUsd.div(lpSupply);
};
