import PreviewGenerate from "./PreviewGenerate";

const PreviewCollection = ({
  listPreview1, 
  listPreview2,
  listPreview3,
  imgTop1,
  imgTop3,
}) => {

    return(
        <div class="contenedor-envolvente ">
          <div style={{transform: "rotate(-14deg)", position: "absolute", left: 90, zIndex: 0, top: imgTop1}}>
            <PreviewGenerate
            listPreview={listPreview1}
            />
          </div>

        <div style={{zIndex: 1, position: "relative", filter:'drop-shadow(0 0 2rem #020310)'}}>

        <PreviewGenerate
          listPreview={listPreview2}
          />
        </div>
          
          <div style={{transform: "rotate(14deg)", position: "absolute", right: 90, zIndex: 0, top: imgTop3}}>

        <PreviewGenerate
        listPreview={listPreview3}
        />
          </div>
        </div>
    );
};

export default PreviewCollection;