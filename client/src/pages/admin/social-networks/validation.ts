import * as yup from "yup";

const urlField = yup
  .string()
  .url()
  .nullable()
  .notRequired();

export const SocialNetworkStoreSchema = yup.object().shape({
  url_facebook: urlField,
  url_twitter: urlField,
  url_instagram: urlField,
  url_tiktok: urlField,
  url_linkedin: urlField,
});

export const SocialNetworkUpdateSchema = yup.object().shape({
  url_facebook: urlField,
  url_twitter: urlField,
  url_instagram: urlField,
  url_tiktok: urlField,
  url_linkedin: urlField,
});
