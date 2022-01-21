<?php
/**
 * @package DLVideo
 * @author David E Luna M <davidlunamontilla@gmail.com>
 * @license MIT
 * @version 0.0.1b
 */
class DLVideo {
    private $base_dir;
    private $path;

    private function processPATH( string $path ): string {
        $pattern = "/\.\.\//";

        preg_match_all($pattern, $path, $found);
        $count = count($found[0]);
        $path = preg_replace($pattern, "", $path);
        $bars = preg_split("/\//", $path);
        $offset = count($bars) - (1 + $count);

        // Eliminar los últimos elementos del array en
        // función de la ruta elegida por el usuario, siempre
        // que sea posible:
        array_splice($bars, $offset, $count);

        // No continuar mientras no me devuelva un Array:
        if ( !is_array($bars) ) return "";

        return join("/", $bars);
    }

    /**
     * @param string $base_dir Directorio base
     * a utilizar para listar archivos de música.
     */
    public function __construct(
        string $base_dir = "/../../",
        string $path = "."
    ) {
        $this->base_dir = (string) __DIR__ . "$base_dir";
        $this->path = (string) $path . "/";
    }

    /**
     * Al ejecutar esta función se listarán un array de archivos
     * señalando la ruta relativa de los archivos de música.
     */
    public function init() : void {
        $path = $this->processPATH($this->base_dir) . $this->path;
        $filter = "/(.webm|.mp4)+$/";

        // echo $path;
        if (!is_dir($path)) {
            is_writable(dirname($this->path))
                ? mkdir($path, 0755, true)
                : ["No tiene permiso para escribir sobre este directorio"];
        }


        $dir = opendir($path);
        $files = [];

        while ($f = readdir($dir)) {
            $excluir = "/[^.]/";
            if (!preg_match($excluir, $f) || is_dir($path . $f)) continue;

            if (preg_match($filter, $f)) {
                array_push($files, $this->path . $f);
            }
        }

        closedir($dir);

        header("content-type: application/json; charset=utf-8");
        echo json_encode($files);
    }
}

// $video = new DLVideo("/multimedia/");
// $video->init();

/*function obtenerVideo() {
    $vid = $_GET['vid']; // Youtube video ID
    $vformat = $_GET['vformat']; // The MIME type of the video. e.g. video/mp4, video/webm, etc.
    parse_str(file_get_contents("http://youtube.com/get_video_info?video_id=".$vid),$info);
    $streams = $info['url_encoded_fmt_stream_map'];
}*/