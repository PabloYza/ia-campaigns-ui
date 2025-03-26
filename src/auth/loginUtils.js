export const isAllowedDomain = (email) => {
    const domain = email.split("@")[1];
    return ["nothingad.com"].includes(domain);
  };
  