import { Link, LinkProps } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Platform } from "react-native";

type ExternalLinkProps = Omit<LinkProps<string>, "href"> & {
  href: string;
};

export function ExternalLink({ href, ...props }: ExternalLinkProps) {
  const handlePress = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | any) => {
      if (Platform.OS !== "web") {
        // Prevent the default behavior of linking to the default browser on native.
        e.preventDefault();
        // Open the link in an in-app browser.
        WebBrowser.openBrowserAsync(href);
      } else {
        // On web, open the link in a new tab
        if (e.currentTarget) {
          e.currentTarget.target = "_blank";
        }
      }
    },
    [href]
  );

  return <Link {...props} href={href as any} onPress={handlePress} />;
}
