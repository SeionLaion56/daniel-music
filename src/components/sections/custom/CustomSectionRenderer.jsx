import { TextBlock }      from './TextBlock';
import { ImageBlock }     from './ImageBlock';
import { TextImageBlock } from './TextImageBlock';
import { QuoteBlock }     from './QuoteBlock';
import { GalleryBlock }   from './GalleryBlock';
import { SocialPostBlock }from './SocialPostBlock';

export function CustomSectionRenderer({ section, isAdmin, onUpdate }) {
  const props = { section, isAdmin, onUpdate };
  switch (section.type) {
    case 'text':        return <TextBlock       {...props} />;
    case 'image':       return <ImageBlock      {...props} />;
    case 'text-image':  return <TextImageBlock  {...props} />;
    case 'quote':       return <QuoteBlock      {...props} />;
    case 'gallery':     return <GalleryBlock    {...props} />;
    case 'social-post': return <SocialPostBlock {...props} />;
    default:            return null;
  }
}
