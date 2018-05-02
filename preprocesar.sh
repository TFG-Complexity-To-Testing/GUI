#!/bin/bash
DIR_PROYECTOS_NODE='./public/proyectos'                     # Directorio que contiene el fichero de las clases y test que el usuario ha subido

DIR_PROYECTO_JAVA='./generadorMutantesJAVA'                 # Directorio que contiene todo el proyecto java generador de mutantes
FILE_POM=$DIR_PROYECTO_JAVA/pom.xml                         # Fichero de configuración maven necesario para la creación de mutantes
FILE_POM_TEMP=$DIR_PROYECTO_JAVA/tempPom/pom.xml            # Fichero base de configuración maven

DIR_PROYECTOJAVA_CLASSES=$DIR_PROYECTO_JAVA/src/main/java   # Directorio donde se descomprimiran las classes originales
DIR_PROYECTOJAVA_TEST=$DIR_PROYECTO_JAVA/src/test/java      # Directorio donde se descomprimiran los tests
DIR_TESTS_POMS=$DIR_PROYECTO_JAVA/testsPoms                 # Directorio donde se guardaran todos los ficheros de
                                                            # configuración de los test que se van a ejecutar
NAME_CLASSES_ZIP='Classes.zip'                              # Nombre del fichero comprimido de las clases originales
NAME_TESTS_ZIP='Tests.zip'                                  # Nombre del fichero comprimido de los test
FILE_CLASSES_ZIP=$DIR_PROYECTOS_NODE/$NAME_CLASSES_ZIP      # Fichero zip que contiene todas las clases originales
FILE_TESTS_ZIP=$DIR_PROYECTOS_NODE/$NAME_TESTS_ZIP          # Fichero zip que contiene todas los tests
DIR_UPLOADS_NODE='./uploads'                                # Directorio que contiene los ficheros que el usuario a subido a la aplicación node

#######################################
#                                     #
# 1. Limpiar los proyectos anteriores #
#                                     #
#######################################

if [ -e $DIR_TESTS_POMS ] ; then
  rm -r $DIR_TESTS_POMS;
fi
mkdir $DIR_TESTS_POMS;

if [ -e $DIR_PROYECTOJAVA_CLASSES ] ; then
  rm -r $DIR_PROYECTOJAVA_CLASSES;
fi
mkdir $DIR_PROYECTOJAVA_CLASSES;

if [ -e $DIR_PROYECTOJAVA_TEST ] ; then
  rm -r $DIR_PROYECTOJAVA_TEST;
fi
mkdir $DIR_PROYECTOJAVA_TEST;

function procAddFilesTestToFilePomRec() {
  for file in "$1"/*
  do
      if [ ! -d "${file}" ] ; then
          # primero quita la extensión, segundo cambia el / por ., tercero quita el primer caracter .
          pathfileFormated=$(echo $file | cut -f 2 -d '.' | sed 's/\//./g' | sed -e 's/^.//')
          nameFile=$(echo "${file}"| rev | cut -d"/" -f1 | rev )
          cd -

          # Añadimos el pathFile al fichero de configuración
          NEW_PARAM="<param>${pathfileFormated}</param>"
          echo $NEW_PARAM >> $FILE_POM
          echo "$(cat ${FILE_POM})</targetTests></configuration></plugin></plugins></build></project>" > $DIR_TESTS_POMS/$nameFile
          cd -
      else
          nameFile=$(echo "${file}"| rev | cut -d"/" -f1 | rev)
          if [[ ! ${nameFile} = "__MACOSX" ]]; then
          procAddFilesTestToFilePomRec "${file}"
          fi
      fi
  done
}

function procAddFilesClasesToFilePomRec() {
  for file in "$1"/*
  do
      if [ ! -d "${file}" ] ; then
          # primero quita la extension, sgundo cambia el / por ., tercero quita el primer caracter .
          pathfileFormated=$(echo $file | cut -f 2 -d '.' | sed 's/\//./g' | sed -e 's/^.//')
          nameFile=$(echo "${file}"| rev | cut -d"/" -f1 | rev )
          cd -

          NEWPARAMS="<param>$pathfileFormated</param>"
          echo $NEWPARAMS >> $FILE_POM
          cd -
      else
          nameFile=$(echo "${file}"| rev | cut -d"/" -f1 | rev)
          if [[ ! ${nameFile} = "__MACOSX" ]]; then
            procAddFilesClasesToFilePomRec "${file}"
          fi
      fi
  done
}

# Creamos un fichero de configuración nuevo,
# a partir del fichero de configuración base que se encuentra
# en en el directorio 'tempPom'

cp $FILE_POM_TEMP $FILE_POM

#########################################################################
#                                                                       #
# 2. Preparamos el fichero de configuración con las clases del programa #
#                                                                       #
#########################################################################

# 2.1. Comprobamos que el fichero zip Classes.zip es un fichero regular
if [ -f $FILE_CLASSES_ZIP ]; then
    echo "File $FILE_CLASSES_ZIP exists."

    # 2.2. Descomprimimos el ficheto Classes.zip en el directorio donde estan clases del proyecto java generador de mutantes
    unzip -o $FILE_CLASSES_ZIP -d $DIR_PROYECTOJAVA_CLASSES

    # 2.3. Para cada fichero clase, agregamos de manera recursiva la ruta de cada fichero en el fichero de configuración pom.xml
    cd $DIR_PROYECTOJAVA_CLASSES
    procAddFilesClasesToFilePomRec "."
    cd -

    # 2.4. Agregamos las etiquetas de cierre de la classes
    # y tambien agregamos las etiquetas de apertura para los tests que se agregaran en el punto 3
    echo "</targetClasses><targetTests>" >> $FILE_POM
else
 echo "File $FILE_CLASSES_ZIP does not exist."
fi

#########################################################################
#                                                                       #
# 3. Preparamos el fichero de configuración con los test del programa   #
#                                                                       #
#########################################################################

# 3.1. Comprobamos que el fichero Test.zip exite
if [ -f $FILE_TESTS_ZIP ]; then
   echo "File $FILE_TESTS_ZIP exists."

   # 3.2. Descomprimimos el ficheto Tests.zip en el directorio de donde estan los test proyecto java generador de mutantes
   unzip -o $FILE_TESTS_ZIP -d $DIR_PROYECTOJAVA_TEST

   # 3.3. Para cada fichero test, agregamos de manera recursiva la ruta de cada fichero en el fichero de configuración pom.xml
   cd $DIR_PROYECTOJAVA_TEST
   procAddFilesTestToFilePomRec  "."
   cd -
   # 3.4. Terminamos de construir el fichero de configuración con las etiquetas de cierre correspondientes
   echo "</targetTests></configuration></plugin></plugins></build></project>" >> $FILE_POM
else
 echo "File $FILE_TESTS_ZIP does not exist."
fi

# Limpiamos el directorio que contiene los ficheros zip
rm -r $DIR_UPLOADS_NODE
mkdir $DIR_UPLOADS_NODE
echo "Terminado"
