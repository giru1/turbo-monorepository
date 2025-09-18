import type { Schema, Struct } from '@strapi/strapi';

export interface SharedCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    Description: Schema.Attribute.String;
    Link: Schema.Attribute.Component<'shared.ssylka', false>;
    Title: Schema.Attribute.String;
  };
}

export interface SharedFooter extends Struct.ComponentSchema {
  collectionName: 'components_shared_footers';
  info: {
    displayName: 'Footer';
  };
  attributes: {
    FooterAddress: Schema.Attribute.String;
    FooterEmail: Schema.Attribute.String;
    FooterMenu: Schema.Attribute.Component<'shared.ssylka', true>;
    FooterPhone: Schema.Attribute.String;
    FooterPhonePK: Schema.Attribute.String;
  };
}

export interface SharedHead extends Struct.ComponentSchema {
  collectionName: 'components_shared_heads';
  info: {
    displayName: 'Head';
  };
  attributes: {};
}

export interface SharedHeader extends Struct.ComponentSchema {
  collectionName: 'components_shared_headers';
  info: {
    displayName: 'HeaderRight';
  };
  attributes: {
    HeaderDescription: Schema.Attribute.Blocks;
    HeaderTitle: Schema.Attribute.String;
  };
}

export interface SharedHeaderLeft extends Struct.ComponentSchema {
  collectionName: 'components_shared_header_lefts';
  info: {
    displayName: 'HeaderLeft';
  };
  attributes: {
    Logo: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    LogoTitle: Schema.Attribute.String;
    MainFone: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedLeftDescription extends Struct.ComponentSchema {
  collectionName: 'components_shared_left_descriptions';
  info: {
    displayName: 'LeftDescription';
  };
  attributes: {
    Description: Schema.Attribute.Blocks;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSidebar extends Struct.ComponentSchema {
  collectionName: 'components_shared_sidebars';
  info: {
    displayName: 'Sidebar';
  };
  attributes: {
    link: Schema.Attribute.Component<'shared.ssylka', true>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSsylka extends Struct.ComponentSchema {
  collectionName: 'components_shared_ssylka';
  info: {
    displayName: 'Link';
  };
  attributes: {
    Link: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.card': SharedCard;
      'shared.footer': SharedFooter;
      'shared.head': SharedHead;
      'shared.header': SharedHeader;
      'shared.header-left': SharedHeaderLeft;
      'shared.left-description': SharedLeftDescription;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.sidebar': SharedSidebar;
      'shared.slider': SharedSlider;
      'shared.ssylka': SharedSsylka;
    }
  }
}
