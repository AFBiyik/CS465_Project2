function Mesh(path) {

    var obj = this;
    loadMesh(path);

    function loadMesh(filename) {
        var mesh = null;
        $.ajax({
            url: filename,
            dataType: 'text',
            timeout: 5000
        }).done(function(data) {
            loadMeshData(data);
        }).fail(function() {
            alert('Faild to retrieve [' + filename + ']');
        });
    }

    function loadMeshData(meshString) {
        var lines = meshString.split("\n");

        var positions = [];
        var normals = [];
        var vertices = [];
        var vertexNormals = [];

        for ( var i = 0 ; i < lines.length ; i++ ) {
            var parts = lines[i].trimRight().split(' ');
            if ( parts.length > 0 ) {
                switch(parts[0]) {
                    case 'v':
                        positions.push(
                            vec4(
                                parseFloat(parts[1]),
                                parseFloat(parts[2]),
                                parseFloat(parts[3])
                            ));
                        break;

                    case 'vn':
                        normals.push(
                            vec4(
                                parseFloat(parts[1]),
                                parseFloat(parts[2]),
                                parseFloat(parts[3])
                            ));
                        break;

                    case 'f': {
                        var f1 = parts[1].split('/');
                        var f2 = parts[2].split('/');
                        var f3 = parts[3].split('/');
                        vertices.push( positions[parseInt(f1[0]) - 1]);
                        vertices.push( positions[parseInt(f2[0]) - 1]);
                        vertices.push( positions[parseInt(f3[0]) - 1]);

                        vertexNormals.push( normals[parseInt(f1[2]) - 1]);
                        vertexNormals.push( normals[parseInt(f2[2]) - 1]);
                        vertexNormals.push( normals[parseInt(f3[2]) - 1]);
                        break;
                    }
                }
            }
        }


        obj.vertices = vertices;
        obj.vertexNormals = vertexNormals;

    }
}




