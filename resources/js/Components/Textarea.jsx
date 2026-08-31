import { forwardRef } from 'react';
import { Textarea as UiTextarea } from '@/Components/ui/textarea';

export default forwardRef(function Textarea({ className = '', rows = 4, ...props }, ref) {
    return <UiTextarea ref={ref} rows={rows} {...props} className={className} />;
});
