import { useEffect } from 'react';
import '../styles/scss/_preview-imgpj.scss'


const PreviewGenerate = (
    {listPreview = []}
    ) => {
        if (!listPreview.length) return null;
    return (
        <div class="">
        <div className="container-preview-success">
          <div className="container-img">
            {listPreview.map((e, index) => (
              <img key={index} src={e.img} alt="" className="preview-img border border-white border-3" />
            ))}
          </div>
      </div>
      </div>
    );
}

export default PreviewGenerate;