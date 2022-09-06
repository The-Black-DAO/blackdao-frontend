import { t, Trans } from "@lingui/macro";
import { Box, Divider, Link, Paper, SvgIcon, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Icon, NavItem } from "@olympusdao/component-library";
import React from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as OlympusIcon } from "src/assets/icons/olympus-nav-header.svg";
import WalletAddressEns from "src/components/TopBar/Wallet/WalletAddressEns";
import { sortByDiscount } from "src/helpers/bonds/sortByDiscount";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { useTestableNetworks } from "src/hooks/useTestableNetworks";
import { BondDiscount } from "src/views/Bond/components/BondDiscount";
import { useLiveBonds } from "src/views/Bond/hooks/useLiveBonds";
import { useNetwork } from "wagmi";

const PREFIX = "NavContent";

const classes = {
  gray: `${PREFIX}-gray`,
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.gray}`]: {
    color: theme.colors.gray[90],
  },
}));

const NavContent: React.VFC = () => {
  const { chain = { id: 1 } } = useNetwork();
  const networks = useTestableNetworks();

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://app.blk.finance/" target="_blank" rel="noopener noreferrer">
              <SvgIcon
                color="primary"
                viewBox="0 0 151 100"
                component={OlympusIcon}
                style={{ minWidth: "151px", minHeight: "98px", width: "151px" }}
              />
            </Link>

            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {chain.id === networks.MAINNET ? (
                <>
                  <NavItem to="/dashboard" icon="dashboard" label={t`Dashboard`} />

                  <NavItem to="/bonds" icon="bond" label={t`Bond`}>
                    <Bonds />
                    {/* <InverseBonds /> */}
                  </NavItem>

                  <NavItem to="/stake" icon="stake" label={t`Stake`} />

                  <NavItem href="https://mint.blk.finance/" icon='zap' label={t`Mint`} />

                  {/* <div className="menu-soon">
                    <NavItem to="/" icon="zap" label={t`Zap`} />
                    <div className="soon-color"> coming soon</div>
                  </div> */}

                  {Environment.isGiveEnabled() && (
                    <div className="menu-soon">
                      <NavItem to="/" icon="give" label={t`Give`} />
                      <div className="soon-color"> coming soon</div>
                    </div>
                  )}

                  {/* <div className="menu-soon">
                    <NavItem to="/" icon="wrap" label={t`Wrap`} />
                    <div className="soon-color"> coming soon</div>
                  </div>

                  <div className="menu-soon">
                    <NavItem icon="bridge" label={t`Bridge`} to="/bridge" />
                    <div className="soon-color"> coming soon</div>
                  </div> */}

                  {/* <Box className="menu-divider">
                    <Divider />
                  </Box>

                  <NavItem href="https://pro.olympusdao.finance/" icon="olympus" label={t`Olympus Pro`} /> */}

                  <Box className="menu-divider">
                    <Divider />
                  </Box>
                </>
              ) : (
                <>
                  <NavItem to="/dashboard" icon="dashboard" label={t`Dashboard`} />
                  {/* <NavItem to="/wrap" icon="wrap" label={t`Wrap`} />

                  <NavItem icon="bridge" label={t`Bridge`} to="/bridge" /> */}
                </>
              )}

              <NavItem href="https://discord.com/invite/N9JHyZjqK9" icon="forum" label={t`Forum`} />

              <NavItem href="https://vote.blk.finance/#/theblackdao.eth" icon="governance" label={t`Governance`} />

              <NavItem href="https://docs.blk.finance/" icon="docs" label={t`Docs`} />

              {/* <NavItem href="" icon="bug-report" label={t`Bug Bounty`} />

              <NavItem href="" icon="grants" label={t`Grants`} /> */}
            </div>
          </div>
        </div>

        <StyledBox display="flex" justifyContent="space-between" paddingX="50px" paddingY="24px">
          <Link href="https://github.com/The-Black-DAO" target="_blank" rel="noopener noreferrer">
            <Icon name="github" className={classes.gray} />
          </Link>

          <Link href="https://mirror.xyz/theblackdao.eth" target="_blank" rel="noopener noreferrer">
            <Icon name="medium" className={classes.gray} />
          </Link>

          <Link href="https://twitter.com/theblackdao" target="_blank" rel="noopener noreferrer">
            <Icon name="twitter" className={classes.gray} />
          </Link>

          <Link href="https://discord.com/invite/N9JHyZjqK9" target="_blank" rel="noopener noreferrer">
            <Icon name="discord" className={classes.gray} />
          </Link>
        </StyledBox>
      </Box>
    </Paper>
  );
};

const Bonds: React.VFC = () => {
  const bonds = useLiveBonds().data;

  if (!bonds || bonds.length === 0) return null;

  return (
    <Box ml="26px" mt="16px" mb="12px">
      {sortByDiscount(bonds)
        .filter(bond => !bond.isSoldOut)
        .map(bond => (
          <Box mt="8px">
            <Link key={bond.id} component={NavLink} to={`/bonds/${bond.id}`}>
              <Typography variant="body1">
                <Box display="flex" flexDirection="row" justifyContent="space-between">
                  {bond.quoteToken.name}
                  <BondDiscount discount={bond.discount} />
                </Box>
              </Typography>
            </Link>
          </Box>
        ))}
    </Box>
  );
};

const InverseBonds: React.VFC = () => {
  const bonds = useLiveBonds({ isInverseBond: true }).data;

  if (!bonds || bonds.length === 0) return null;

  return (
    <Box ml="26px" mt="16px" mb="12px">
      <Typography variant="body2" color="textSecondary">
        <Trans>Inverse Bonds</Trans>
      </Typography>

      <Box mt="12px">
        {sortByDiscount(bonds)
          .filter(bond => !bond.isSoldOut)
          .map(bond => (
            <Box mt="8px">
              <Link key={bond.id} component={NavLink} to={`/bonds/inverse/${bond.id}`}>
                <Typography variant="body1">
                  <Box display="flex" flexDirection="row" justifyContent="space-between">
                    {bond.quoteToken.name}
                    <BondDiscount discount={bond.discount} />
                  </Box>
                </Typography>
              </Link>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default NavContent;
