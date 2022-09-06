import { t } from "@lingui/macro";

export const BondInfoText: React.VFC<{ isInverseBond: boolean }> = ({ isInverseBond }) => (
  <>
    {isInverseBond
      ? t`Important: Inverse bonds allow you to bond your BLKD for treasury assets. Vesting time is 0 and payouts are instant.`
      : t`Important: New bonds are auto-staked (accrue rebase rewards) and no longer vest linearly. Simply claim as sBLKD or gBLKD at the end of the term.`}
  </>
);
