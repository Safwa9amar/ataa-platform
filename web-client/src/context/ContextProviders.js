// /context/ContextProviders.js
"use client";

import { ThemeProvider as MTThemeProvider } from "@material-tailwind/react";
import { ThemeProvider } from "./ThemeContext";
import { AlgeriaCitiesProvider } from "./AlgeriaCitiesContext";
import { FieldCategoryProvider } from "./FieldCategoryContext";
import { SavedDonationOpportunitiesProvider } from "./SavedDonationOpportunitiesContext";
import { CredentialsProvider } from "./CredentialsContext";
import { ZakatProvider } from "./ZakatContext";
import { CurrencyProvider } from "./CurrencyContext";
import { PreciousMetalsProvider } from "./PreciousMetalsContext";
import { CampaignProvider } from "./CampaignContext";
import { CartProvider } from "./CartContext";
import { StoreProvider } from "./StoreContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SavedStoreOpportunitiesProvider } from "./SavedStoreOpportunitiesContext";
import { SavedCampaignsProvider } from "./SavedCampaignsContext";
import { ShareProvider } from "./ShareContext";
import { NotificationProvider } from "./NotificationContext";
import { CreateCampaignProvider } from "./CreateCampaignContext";
import { EnumsProvider } from "./EnumsContext";

export default function ContextProviders({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_WEB_CLIENT_ID}>
      <EnumsProvider>
        <CredentialsProvider>
          <NotificationProvider>
            <ThemeProvider>
              <MTThemeProvider>
                <FieldCategoryProvider>
                  <ZakatProvider>
                    <CurrencyProvider>
                      <PreciousMetalsProvider>
                        <SavedDonationOpportunitiesProvider>
                          <SavedStoreOpportunitiesProvider>
                            <SavedCampaignsProvider>
                              <CartProvider>
                                <CampaignProvider>
                                  <CreateCampaignProvider>
                                    <AlgeriaCitiesProvider>
                                      <ShareProvider>
                                        <StoreProvider>
                                          {children}
                                        </StoreProvider>
                                      </ShareProvider>
                                    </AlgeriaCitiesProvider>
                                  </CreateCampaignProvider>
                                </CampaignProvider>
                              </CartProvider>
                            </SavedCampaignsProvider>
                          </SavedStoreOpportunitiesProvider>
                        </SavedDonationOpportunitiesProvider>
                      </PreciousMetalsProvider>
                    </CurrencyProvider>
                  </ZakatProvider>
                </FieldCategoryProvider>
              </MTThemeProvider>
            </ThemeProvider>
          </NotificationProvider>
        </CredentialsProvider>
      </EnumsProvider>
    </GoogleOAuthProvider>
  );
}
